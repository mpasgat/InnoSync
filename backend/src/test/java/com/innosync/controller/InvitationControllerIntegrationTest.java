package com.innosync.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.innosync.dto.project.InvitationRequest;
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

import java.time.LocalDateTime;
import java.util.List;

import static org.hamcrest.Matchers.*;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.*;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest
@ActiveProfiles("test")
@Import(com.innosync.config.TestContainersConfig.class)
@Transactional
class InvitationControllerIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectRoleRepository projectRoleRepository;

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private TechnologyRepository technologyRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    @Autowired
    private JwtUtil jwtUtil;

    private MockMvc mockMvc;
    private User recruiter;
    private User developer1;
    private User developer2;
    private String recruiterToken;
    private String developer1Token;
    private String developer2Token;
    private Project project;
    private ProjectRole projectRole;
    private Technology java;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();

        // Clean database
        invitationRepository.deleteAll();
        projectRoleRepository.deleteAll();
        projectRepository.deleteAll();
        technologyRepository.deleteAll();
        userRepository.deleteAll();

        // Create test users
        recruiter = new User("recruiter@example.com", "Recruiter", passwordEncoder.encode("password"));
        developer1 = new User("dev1@example.com", "Developer One", passwordEncoder.encode("password"));
        developer2 = new User("dev2@example.com", "Developer Two", passwordEncoder.encode("password"));
        userRepository.saveAll(List.of(recruiter, developer1, developer2));

        // Create JWT tokens
        recruiterToken = jwtUtil.generateToken(recruiter.getEmail());
        developer1Token = jwtUtil.generateToken(developer1.getEmail());
        developer2Token = jwtUtil.generateToken(developer2.getEmail());

        // Create test technology
        java = new Technology("Java");
        technologyRepository.save(java);

        // Create test project and role
        project = Project.builder()
                .title("E-commerce Platform")
                .description("Building a modern e-commerce platform")
                .recruiter(recruiter)
                .projectType(ProjectType.FREELANCE)
                .teamSize(TeamSize.FourSix)
                .build();
        project = projectRepository.save(project);

        projectRole = new ProjectRole();
        projectRole.setProject(project);
        projectRole.setRoleName("Backend Developer");
        projectRole.setExpertiseLevel(ExpertiseLevel.SENIOR);
        projectRole.setTechnologies(List.of(java));
        projectRole = projectRoleRepository.save(projectRole);
    }

    @Test
    void createInvitation_WithValidData_ShouldCreateInvitation() throws Exception {
        // Given
        InvitationRequest request = new InvitationRequest();
        request.setProjectRoleId(projectRole.getId());
        request.setRecipientId(developer1.getId());

        // When & Then
        mockMvc.perform(post("/api/invitations")
                        .header("Authorization", "Bearer " + recruiterToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.projectRoleId", is(projectRole.getId().intValue())))
                .andExpect(jsonPath("$.roleName", is("Backend Developer")))
                .andExpect(jsonPath("$.projectId", is(project.getId().intValue())))
                .andExpect(jsonPath("$.projectTitle", is("E-commerce Platform")))
                .andExpect(jsonPath("$.recipientId", is(developer1.getId().intValue())))
                .andExpect(jsonPath("$.recipientName", is("Developer One")))
                .andExpect(jsonPath("$.status", is("INVITED")))
                .andExpect(jsonPath("$.sentAt", notNullValue()))
                .andExpect(jsonPath("$.id", notNullValue()));

        // Verify in database
        List<Invitation> invitations = invitationRepository.findAll();
        assert invitations.size() == 1;
        assert invitations.get(0).getStatus() == InvitationStatus.INVITED;
    }

    @Test
    void createInvitation_WithoutAuthentication_ShouldReturnForbidden() throws Exception {
        // Given
        InvitationRequest request = new InvitationRequest();
        request.setProjectRoleId(projectRole.getId());
        request.setRecipientId(developer1.getId());

        // When & Then
        mockMvc.perform(post("/api/invitations")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void createInvitation_WithInvalidToken_ShouldReturnForbidden() throws Exception {
        // Given
        InvitationRequest request = new InvitationRequest();
        request.setProjectRoleId(projectRole.getId());
        request.setRecipientId(developer1.getId());

        // When & Then
        mockMvc.perform(post("/api/invitations")
                        .header("Authorization", "Bearer invalid-token")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void createInvitation_WithNonExistentProjectRole_ShouldReturnNotFound() throws Exception {
        // Given
        InvitationRequest request = new InvitationRequest();
        request.setProjectRoleId(999L);
        request.setRecipientId(developer1.getId());

        // When & Then
        mockMvc.perform(post("/api/invitations")
                        .header("Authorization", "Bearer " + recruiterToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void createInvitation_WithNonExistentRecipient_ShouldReturnNotFound() throws Exception {
        // Given
        InvitationRequest request = new InvitationRequest();
        request.setProjectRoleId(projectRole.getId());
        request.setRecipientId(999L);

        // When & Then
        mockMvc.perform(post("/api/invitations")
                        .header("Authorization", "Bearer " + recruiterToken)
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isNotFound());
    }

    @Test
    void createInvitation_AsNonOwner_ShouldReturnForbidden() throws Exception {
        // Given
        InvitationRequest request = new InvitationRequest();
        request.setProjectRoleId(projectRole.getId());
        request.setRecipientId(developer2.getId());

        // When & Then
        mockMvc.perform(post("/api/invitations")
                        .header("Authorization", "Bearer " + developer1Token) // Not the project owner
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(request)))
                .andExpect(status().isForbidden());
    }

    @Test
    void respondToInvitation_WithAccept_ShouldUpdateInvitationStatus() throws Exception {
        // Given
        Invitation invitation = Invitation.builder()
                .projectRole(projectRole)
                .sender(recruiter)
                .recipient(developer1)
                .status(InvitationStatus.INVITED)
                .sentAt(LocalDateTime.now())
                .build();
        invitation = invitationRepository.save(invitation);

        // When & Then
        mockMvc.perform(patch("/api/invitations/{invitationId}/respond", invitation.getId())
                        .header("Authorization", "Bearer " + developer1Token)
                        .param("response", "ACCEPTED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(invitation.getId().intValue())))
                .andExpect(jsonPath("$.status", is("ACCEPTED")))
                .andExpect(jsonPath("$.respondedAt", notNullValue()));

        // Verify in database
        Invitation updatedInvitation = invitationRepository.findById(invitation.getId()).orElse(null);
        assert updatedInvitation != null;
        assert updatedInvitation.getStatus() == InvitationStatus.ACCEPTED;
    }

    @Test
    void respondToInvitation_WithDecline_ShouldUpdateInvitationStatus() throws Exception {
        // Given
        Invitation invitation = Invitation.builder()
                .projectRole(projectRole)
                .sender(recruiter)
                .recipient(developer1)
                .status(InvitationStatus.INVITED)
                .sentAt(LocalDateTime.now())
                .build();
        invitation = invitationRepository.save(invitation);

        // When & Then
        mockMvc.perform(patch("/api/invitations/{invitationId}/respond", invitation.getId())
                        .header("Authorization", "Bearer " + developer1Token)
                        .param("response", "DECLINED"))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.id", is(invitation.getId().intValue())))
                .andExpect(jsonPath("$.status", is("DECLINED")))
                .andExpect(jsonPath("$.respondedAt", notNullValue()));
    }

    @Test
    void respondToInvitation_WithoutAuthentication_ShouldReturnForbidden() throws Exception {
        // Given
        Invitation invitation = Invitation.builder()
                .projectRole(projectRole)
                .sender(recruiter)
                .recipient(developer1)
                .status(InvitationStatus.INVITED)
                .sentAt(LocalDateTime.now())
                .build();
        invitation = invitationRepository.save(invitation);

        // When & Then
        mockMvc.perform(patch("/api/invitations/{invitationId}/respond", invitation.getId())
                        .param("response", "ACCEPTED"))
                .andExpect(status().isForbidden());
    }

    @Test
    void respondToInvitation_ToNonExistentInvitation_ShouldReturnNotFound() throws Exception {
        // When & Then
        mockMvc.perform(patch("/api/invitations/{invitationId}/respond", 999L)
                        .header("Authorization", "Bearer " + developer1Token)
                        .param("response", "ACCEPTED"))
                .andExpect(status().isNotFound());
    }

    @Test
    void respondToInvitation_AsWrongRecipient_ShouldReturnForbidden() throws Exception {
        // Given
        Invitation invitation = Invitation.builder()
                .projectRole(projectRole)
                .sender(recruiter)
                .recipient(developer1)
                .status(InvitationStatus.INVITED)
                .sentAt(LocalDateTime.now())
                .build();
        invitation = invitationRepository.save(invitation);

        // When & Then
        mockMvc.perform(patch("/api/invitations/{invitationId}/respond", invitation.getId())
                        .header("Authorization", "Bearer " + developer2Token) // Wrong recipient
                        .param("response", "ACCEPTED"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getSentInvitations_WithExistingInvitations_ShouldReturnInvitations() throws Exception {
        // Given
        Invitation invitation1 = Invitation.builder()
                .projectRole(projectRole)
                .sender(recruiter)
                .recipient(developer1)
                .status(InvitationStatus.INVITED)
                .sentAt(LocalDateTime.now())
                .build();

        Invitation invitation2 = Invitation.builder()
                .projectRole(projectRole)
                .sender(recruiter)
                .recipient(developer2)
                .status(InvitationStatus.ACCEPTED)
                .sentAt(LocalDateTime.now())
                .respondedAt(LocalDateTime.now())
                .build();

        invitationRepository.saveAll(List.of(invitation1, invitation2));

        // When & Then
        mockMvc.perform(get("/api/invitations/sent")
                        .header("Authorization", "Bearer " + recruiterToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[*].recipientName", containsInAnyOrder("Developer One", "Developer Two")))
                .andExpect(jsonPath("$[*].status", containsInAnyOrder("INVITED", "ACCEPTED")));
    }

    @Test
    void getSentInvitations_WithNoInvitations_ShouldReturnEmptyList() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/invitations/sent")
                        .header("Authorization", "Bearer " + recruiterToken))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void getSentInvitations_WithoutAuthentication_ShouldReturnForbidden() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/invitations/sent"))
                .andExpect(status().isForbidden());
    }

    @Test
    void getReceivedInvitations_WithExistingInvitations_ShouldReturnInvitations() throws Exception {
        // Given
        Invitation invitation1 = Invitation.builder()
                .projectRole(projectRole)
                .sender(recruiter)
                .recipient(developer1)
                .status(InvitationStatus.INVITED)
                .sentAt(LocalDateTime.now())
                .build();

        Invitation invitation2 = Invitation.builder()
                .projectRole(projectRole)
                .sender(recruiter)
                .recipient(developer1)
                .status(InvitationStatus.DECLINED)
                .sentAt(LocalDateTime.now())
                .respondedAt(LocalDateTime.now())
                .build();

        invitationRepository.saveAll(List.of(invitation1, invitation2));

        // When & Then
        mockMvc.perform(get("/api/invitations/received")
                        .header("Authorization", "Bearer " + developer1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(2)))
                .andExpect(jsonPath("$[*].recipientName", everyItem(is("Developer One"))))
                .andExpect(jsonPath("$[*].status", containsInAnyOrder("INVITED", "DECLINED")));
    }

    @Test
    void getReceivedInvitations_WithNoInvitations_ShouldReturnEmptyList() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/invitations/received")
                        .header("Authorization", "Bearer " + developer1Token))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$", hasSize(0)));
    }

    @Test
    void getReceivedInvitations_WithoutAuthentication_ShouldReturnForbidden() throws Exception {
        // When & Then
        mockMvc.perform(get("/api/invitations/received"))
                .andExpect(status().isForbidden());
    }

    @Test
    void createInvitation_WithAllInvitationStatuses_ShouldHandleAllEnumValues() throws Exception {
        // Test invitation creation and response with different statuses
        InvitationStatus[] statuses = {InvitationStatus.INVITED, InvitationStatus.ACCEPTED, InvitationStatus.DECLINED};

        for (int i = 0; i < statuses.length; i++) {
            // Create invitation
            InvitationRequest request = new InvitationRequest();
            request.setProjectRoleId(projectRole.getId());
            request.setRecipientId(developer1.getId());

            String response = mockMvc.perform(post("/api/invitations")
                            .header("Authorization", "Bearer " + recruiterToken)
                            .contentType(MediaType.APPLICATION_JSON)
                            .content(objectMapper.writeValueAsString(request)))
                    .andExpect(status().isOk())
                    .andReturn().getResponse().getContentAsString();

            // Extract invitation ID and respond if not initial INVITED status
            if (statuses[i] != InvitationStatus.INVITED) {
                // Parse response to get invitation ID
                // Then respond to it
                Long invitationId = Long.valueOf(response.split("\"id\":")[1].split(",")[0]);
                
                mockMvc.perform(patch("/api/invitations/{invitationId}/respond", invitationId)
                                .header("Authorization", "Bearer " + developer1Token)
                                .param("response", statuses[i].name()))
                        .andExpect(status().isOk())
                        .andExpect(jsonPath("$.status", is(statuses[i].name())));
            }

            // Clean up for next iteration
            invitationRepository.deleteAll();
        }
    }
} 