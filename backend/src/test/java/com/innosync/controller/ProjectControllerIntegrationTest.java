package com.innosync.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.innosync.dto.project.ProjectRequest;
import com.innosync.dto.project.ProjectRoleRequest;
import com.innosync.model.*;
import com.innosync.repository.*;
import com.innosync.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@Import(com.innosync.config.TestContainersConfig.class)
@Transactional
class ProjectControllerIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectRoleRepository projectRoleRepository;

    @Autowired
    private TechnologyRepository technologyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtUtil jwtUtil;

    private MockMvc mockMvc;
    private User recruiter1;
    private User recruiter2;
    private User developer;
    private String recruiter1Token;
    private String recruiter2Token;
    private String developerToken;
    private Technology java;
    private Technology spring;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        // Clean database
        projectRoleRepository.deleteAll();
        projectRepository.deleteAll();
        technologyRepository.deleteAll();
        userRepository.deleteAll();

        // Create test users
        recruiter1 = new User("recruiter1@example.com", "Recruiter One", passwordEncoder.encode("password"));
        recruiter2 = new User("recruiter2@example.com", "Recruiter Two", passwordEncoder.encode("password"));
        developer = new User("dev@example.com", "Developer", passwordEncoder.encode("password"));
        userRepository.saveAll(List.of(recruiter1, recruiter2, developer));

        // Create JWT tokens
        recruiter1Token = jwtUtil.generateToken(recruiter1.getEmail());
        recruiter2Token = jwtUtil.generateToken(recruiter2.getEmail());
        developerToken = jwtUtil.generateToken(developer.getEmail());

        // Create test technologies
        java = new Technology("Java");
        spring = new Technology("Spring Boot");
        technologyRepository.saveAll(List.of(java, spring));
    }

    @Test
    void createProject_WithValidData_ShouldCreateProject() throws Exception {
        // Given
        ProjectRequest request = new ProjectRequest();
        request.setTitle("E-commerce Platform");
        request.setDescription("Building a modern e-commerce platform with microservices");
        request.setProjectType(ProjectType.FREELANCE);
        request.setTeamSize(TeamSize.FourSix);

        // When & Then
        mockMvc.perform(post("/api/projects")
                        .header("Authorization", "Bearer " + recruiter1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.title", is("E-commerce Platform")))
                .andExpect(jsonPath("$.description", is("Building a modern e-commerce platform with microservices")))
                .andExpect(jsonPath("$.projectType", is("FREELANCE")))
                .andExpect(jsonPath("$.teamSize", is("FourSix")))
                .andExpect(jsonPath("$.id", notNullValue()))
                .andExpect(jsonPath("$.createdAt", notNullValue()))
                .andExpect(jsonPath("$.updatedAt", notNullValue()));

        // Verify in database
        List<Project> projects = projectRepository.findAll();
        assert projects.size() == 1;
        assert projects.get(0).getTitle().equals("E-commerce Platform");
    }

    @Test
    void createProject_WithoutAuthentication_ShouldReturnUnauthorized() throws Exception {
        // Given
        ProjectRequest request = new ProjectRequest();
        request.setTitle("Test Project");
        request.setDescription("Test description");
        request.setProjectType(ProjectType.FREELANCE);
        request.setTeamSize(TeamSize.OneThree);

        // When & Then
        mockMvc.perform(post("/api/projects")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void createProject_WithInvalidToken_ShouldReturnUnauthorized() throws Exception {
        // Given
        ProjectRequest request = new ProjectRequest();
        request.setTitle("Test Project");
        request.setDescription("Test description");
        request.setProjectType(ProjectType.FREELANCE);
        request.setTeamSize(TeamSize.OneThree);

        // When & Then
        mockMvc.perform(post("/api/projects")
                        .header("Authorization", "Bearer invalid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void getMyProjects_WithExistingProjects_ShouldReturnUserProjects() throws Exception {
        // Given
        Project project1 = Project.builder()
                .title("Project 1")
                .description("Description 1")
                .recruiter(recruiter1)
                .projectType(ProjectType.FREELANCE)
                .teamSize(TeamSize.OneThree)
                .build();

        Project project2 = Project.builder()
                .title("Project 2")
                .description("Description 2")
                .recruiter(recruiter1)
                .projectType(ProjectType.RESEARCH)
                .teamSize(TeamSize.FourSix)
                .build();

        Project otherProject = Project.builder()
                .title("Other Project")
                .description("Other description")
                .recruiter(recruiter2)
                .projectType(ProjectType.ACADEMIC)
                .teamSize(TeamSize.SevenPlus)
                .build();

        projectRepository.saveAll(List.of(project1, project2, otherProject));

        // When & Then
        mockMvc.perform(get("/api/projects/me")
                        .header("Authorization", "Bearer " + recruiter1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[*].title", containsInAnyOrder("Project 1", "Project 2")));
    }

    @Test
    void getMyProjects_WithNoProjects_ShouldReturnEmptyList() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/projects/me")
                        .header("Authorization", "Bearer " + recruiter1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void addRole_WithValidData_ShouldCreateProjectRole() throws Exception {
        // Given
        Project project = Project.builder()
                .title("Test Project")
                .description("Test description")
                .recruiter(recruiter1)
                .projectType(ProjectType.FREELANCE)
                .teamSize(TeamSize.FourSix)
                .build();
        Project savedProject = projectRepository.save(project);

        ProjectRoleRequest roleRequest = new ProjectRoleRequest();
        roleRequest.setRoleName("Backend Developer");
        roleRequest.setExpertiseLevel(ExpertiseLevel.SENIOR);
        roleRequest.setTechnologies(List.of("Java", "Spring Boot"));

        // When & Then
        mockMvc.perform(post("/api/projects/{projectId}/roles", savedProject.getId())
                        .header("Authorization", "Bearer " + recruiter1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(roleRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.roleName", is("Backend Developer")))
                .andExpect(jsonPath("$.expertiseLevel", is("SENIOR")))
                .andExpect(jsonPath("$.technologies", hasSize(2)))
                .andExpect(jsonPath("$.technologies[*]", containsInAnyOrder("Java", "Spring Boot")));

        // Verify in database
        List<ProjectRole> roles = projectRoleRepository.findAll();
        assert roles.size() == 1;
        assert roles.get(0).getRoleName().equals("Backend Developer");
    }

    @Test
    void addRole_AsNonOwner_ShouldReturnForbidden() throws Exception {
        // Given
        Project project = Project.builder()
                .title("Test Project")
                .description("Test description")
                .recruiter(recruiter1)
                .projectType(ProjectType.FREELANCE)
                .teamSize(TeamSize.FourSix)
                .build();
        Project savedProject = projectRepository.save(project);

        ProjectRoleRequest roleRequest = new ProjectRoleRequest();
        roleRequest.setRoleName("Backend Developer");
        roleRequest.setExpertiseLevel(ExpertiseLevel.SENIOR);
        roleRequest.setTechnologies(List.of("Java"));

        // When & Then
        mockMvc.perform(post("/api/projects/{projectId}/roles", savedProject.getId())
                        .header("Authorization", "Bearer " + recruiter2Token) // Different user
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(roleRequest)))
                .andExpect(status().isForbidden());
    }

    @Test
    void addRole_ToNonExistentProject_ShouldReturnNotFound() throws Exception {
        // Given
        ProjectRoleRequest roleRequest = new ProjectRoleRequest();
        roleRequest.setRoleName("Backend Developer");
        roleRequest.setExpertiseLevel(ExpertiseLevel.SENIOR);
        roleRequest.setTechnologies(List.of("Java"));

        // When & Then
        mockMvc.perform(post("/api/projects/{projectId}/roles", 999L)
                        .header("Authorization", "Bearer " + recruiter1Token)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(roleRequest)))
                .andExpect(status().isNotFound());
    }

    @Test
    void getRoles_WithExistingRoles_ShouldReturnProjectRoles() throws Exception {
        // Given
        Project project = Project.builder()
                .title("Test Project")
                .description("Test description")
                .recruiter(recruiter1)
                .projectType(ProjectType.FREELANCE)
                .teamSize(TeamSize.FourSix)
                .build();
        Project savedProject = projectRepository.save(project);

        ProjectRole role1 = new ProjectRole();
        role1.setProject(savedProject);
        role1.setRoleName("Frontend Developer");
        role1.setExpertiseLevel(ExpertiseLevel.MID);
        role1.setTechnologies(List.of(spring));

        ProjectRole role2 = new ProjectRole();
        role2.setProject(savedProject);
        role2.setRoleName("Backend Developer");
        role2.setExpertiseLevel(ExpertiseLevel.SENIOR);
        role2.setTechnologies(List.of(java, spring));

        projectRoleRepository.saveAll(List.of(role1, role2));

        // When & Then
        mockMvc.perform(get("/api/projects/{projectId}/roles", savedProject.getId())
                        .header("Authorization", "Bearer " + recruiter1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[*].roleName", containsInAnyOrder("Frontend Developer", "Backend Developer")));
    }

    @Test
    void getAllRolesWithProjectInfo_ShouldReturnAllAvailableRoles() throws Exception {
        // Given
        Project project1 = Project.builder()
                .title("E-commerce Project")
                .description("Building e-commerce platform")
                .recruiter(recruiter1)
                .projectType(ProjectType.FREELANCE)
                .teamSize(TeamSize.FourSix)
                .build();

        Project project2 = Project.builder()
                .title("Research Project")
                .description("AI research project")
                .recruiter(recruiter2)
                .projectType(ProjectType.RESEARCH)
                .teamSize(TeamSize.OneThree)
                .build();

        projectRepository.saveAll(List.of(project1, project2));

        ProjectRole role1 = new ProjectRole();
        role1.setProject(project1);
        role1.setRoleName("Frontend Developer");
        role1.setExpertiseLevel(ExpertiseLevel.MID);

        ProjectRole role2 = new ProjectRole();
        role2.setProject(project2);
        role2.setRoleName("ML Engineer");
        role2.setExpertiseLevel(ExpertiseLevel.SENIOR);

        projectRoleRepository.saveAll(List.of(role1, role2));

        // When & Then
        mockMvc.perform(get("/api/projects/roles")
                        .header("Authorization", "Bearer " + developerToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[*].roleName", containsInAnyOrder("Frontend Developer", "ML Engineer")))
                .andExpect(jsonPath("$[*].projectTitle", containsInAnyOrder("E-commerce Project", "Research Project")));
    }

    @Test
    void createProject_WithAllProjectTypes_ShouldHandleAllEnumValues() throws Exception {
        // Test each ProjectType enum value
        ProjectType[] projectTypes = {ProjectType.FREELANCE, ProjectType.RESEARCH, ProjectType.ACADEMIC, ProjectType.HACKATHON};

        for (ProjectType type : projectTypes) {
            // Given
            ProjectRequest request = new ProjectRequest();
            request.setTitle("Project " + type.name());
            request.setDescription("Description for " + type.name());
            request.setProjectType(type);
            request.setTeamSize(TeamSize.OneThree);

            // When & Then
            mockMvc.perform(post("/api/projects")
                            .header("Authorization", "Bearer " + recruiter1Token)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andExpect(jsonPath("$.projectType", is(type.name())));
        }
    }
} 