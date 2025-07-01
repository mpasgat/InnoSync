package com.innosync.service;

import com.innosync.dto.project.ProjectRoleRequest;
import com.innosync.dto.project.ProjectRoleResponse;
import com.innosync.dto.project.ProjectRoleWithProjectResponse;
import com.innosync.model.*;
import com.innosync.repository.ProjectRepository;
import com.innosync.repository.ProjectRoleRepository;
import com.innosync.repository.TechnologyRepository;
import com.innosync.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.util.*;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class ProjectRoleServiceTest {

    @Mock
    private ProjectRoleRepository roleRepository;

    @Mock
    private ProjectRepository projectRepository;

    @Mock
    private UserRepository userRepository;

    @Mock
    private TechnologyRepository technologyRepository;

    @InjectMocks
    private ProjectRoleService projectRoleService;

    private User testUser;
    private Project testProject;
    private ProjectRole testProjectRole;
    private ProjectRoleRequest roleRequest;
    private Technology testTechnology;

    @BeforeEach
    void setUp() {
        testUser = new User("creator@example.com", "Project Creator", "password");
        testUser.setId(1L);

        testProject = Project.builder()
                .id(1L)
                .title("Test Project")
                .description("Test Description")
                .recruiter(testUser)
                .build();

        testTechnology = Technology.builder()
                .id(1L)
                .name("Java")
                .build();

        testProjectRole = new ProjectRole();
        testProjectRole.setId(1L);
        testProjectRole.setProject(testProject);
        testProjectRole.setRoleName("Backend Developer");
        testProjectRole.setExpertiseLevel(ExpertiseLevel.MID);
        testProjectRole.setTechnologies(Arrays.asList(testTechnology));

        roleRequest = new ProjectRoleRequest();
        roleRequest.setRoleName("Backend Developer");
        roleRequest.setExpertiseLevel(ExpertiseLevel.MID);
        roleRequest.setTechnologies(Arrays.asList("Java"));
    }

    @Test
    void addRoleToProject_WithValidData_ShouldCreateRole() {
        // Given
        Long projectId = 1L;
        String creatorEmail = "creator@example.com";

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(testProject));
        when(technologyRepository.findByNameIgnoreCase("Java")).thenReturn(Optional.of(testTechnology));
        when(roleRepository.save(any(ProjectRole.class))).thenReturn(testProjectRole);

        // When
        ProjectRoleResponse result = projectRoleService.addRoleToProject(projectId, roleRequest, creatorEmail);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getRoleName()).isEqualTo("Backend Developer");
        assertThat(result.getExpertiseLevel()).isEqualTo(ExpertiseLevel.MID);

        verify(projectRepository).findById(projectId);
        verify(technologyRepository).findByNameIgnoreCase("Java");
        verify(roleRepository).save(any(ProjectRole.class));
    }

    @Test
    void addRoleToProject_WithNonExistentProject_ShouldThrowException() {
        // Given
        Long projectId = 999L;
        String creatorEmail = "creator@example.com";

        when(projectRepository.findById(projectId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> projectRoleService.addRoleToProject(projectId, roleRequest, creatorEmail))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Project not found");

        verify(projectRepository).findById(projectId);
        verifyNoInteractions(roleRepository);
    }

    @Test
    void addRoleToProject_WithUnauthorizedUser_ShouldThrowAccessDeniedException() {
        // Given
        Long projectId = 1L;
        String unauthorizedEmail = "unauthorized@example.com";

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(testProject));

        // When & Then
        assertThatThrownBy(() -> projectRoleService.addRoleToProject(projectId, roleRequest, unauthorizedEmail))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("You are not the creator of this project.");

        verify(projectRepository).findById(projectId);
        verifyNoInteractions(roleRepository);
    }

    @Test
    void addRoleToProject_WithNewTechnology_ShouldCreateTechnology() {
        // Given
        Long projectId = 1L;
        String creatorEmail = "creator@example.com";
        String newTechName = "Python";
        
        Technology newTechnology = new Technology(newTechName);
        newTechnology.setId(2L);
        
        roleRequest.setTechnologies(Arrays.asList(newTechName));

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(testProject));
        when(technologyRepository.findByNameIgnoreCase(newTechName)).thenReturn(Optional.empty());
        when(technologyRepository.save(any(Technology.class))).thenReturn(newTechnology);
        when(roleRepository.save(any(ProjectRole.class))).thenReturn(testProjectRole);

        // When
        ProjectRoleResponse result = projectRoleService.addRoleToProject(projectId, roleRequest, creatorEmail);

        // Then
        assertThat(result).isNotNull();
        
        verify(technologyRepository).findByNameIgnoreCase(newTechName);
        verify(technologyRepository).save(any(Technology.class));
        verify(roleRepository).save(any(ProjectRole.class));
    }

    @Test
    void addRoleToProject_WithMultipleTechnologies_ShouldHandleAll() {
        // Given
        Long projectId = 1L;
        String creatorEmail = "creator@example.com";
        
        Technology springTech = new Technology("Spring");
        springTech.setId(3L);
        
        roleRequest.setTechnologies(Arrays.asList("Java", "Spring"));

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(testProject));
        when(technologyRepository.findByNameIgnoreCase("Java")).thenReturn(Optional.of(testTechnology));
        when(technologyRepository.findByNameIgnoreCase("Spring")).thenReturn(Optional.of(springTech));
        when(roleRepository.save(any(ProjectRole.class))).thenReturn(testProjectRole);

        // When
        ProjectRoleResponse result = projectRoleService.addRoleToProject(projectId, roleRequest, creatorEmail);

        // Then
        assertThat(result).isNotNull();
        
        verify(technologyRepository).findByNameIgnoreCase("Java");
        verify(technologyRepository).findByNameIgnoreCase("Spring");
        verify(roleRepository).save(any(ProjectRole.class));
    }

    @Test
    void addRoleToProject_WithEmptyTechnologies_ShouldCreateRoleWithoutTechnologies() {
        // Given
        Long projectId = 1L;
        String creatorEmail = "creator@example.com";
        
        roleRequest.setTechnologies(Collections.emptyList());

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(testProject));
        when(roleRepository.save(any(ProjectRole.class))).thenReturn(testProjectRole);

        // When
        ProjectRoleResponse result = projectRoleService.addRoleToProject(projectId, roleRequest, creatorEmail);

        // Then
        assertThat(result).isNotNull();
        
        verify(projectRepository).findById(projectId);
        verify(roleRepository).save(any(ProjectRole.class));
        verifyNoInteractions(technologyRepository);
    }

    @Test
    void addRoleToProject_WithDifferentExpertiseLevels_ShouldWork() {
        // Given
        Long projectId = 1L;
        String creatorEmail = "creator@example.com";
        
        roleRequest.setExpertiseLevel(ExpertiseLevel.ENTRY);
        testProjectRole.setExpertiseLevel(ExpertiseLevel.ENTRY  );

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(testProject));
        when(technologyRepository.findByNameIgnoreCase("Java")).thenReturn(Optional.of(testTechnology));
        when(roleRepository.save(any(ProjectRole.class))).thenReturn(testProjectRole);

        // When
        ProjectRoleResponse result = projectRoleService.addRoleToProject(projectId, roleRequest, creatorEmail);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getExpertiseLevel()).isEqualTo(ExpertiseLevel.ENTRY);
    }

    @Test
    void addRoleToProject_WithNullTechnologies_ShouldHandleGracefully() {
        // Given
        Long projectId = 1L;
        String creatorEmail = "creator@example.com";
        
        roleRequest.setTechnologies(null);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(testProject));

        // When & Then
        assertThatThrownBy(() -> projectRoleService.addRoleToProject(projectId, roleRequest, creatorEmail))
                .isInstanceOf(NullPointerException.class);

        verify(projectRepository).findById(projectId);
    }

    @Test
    void addRoleToProject_WithLongRoleName_ShouldCreateRole() {
        // Given
        Long projectId = 1L;
        String creatorEmail = "creator@example.com";
        String longRoleName = "Senior Full Stack Developer with DevOps Experience";
        
        roleRequest.setRoleName(longRoleName);
        testProjectRole.setRoleName(longRoleName);

        when(projectRepository.findById(projectId)).thenReturn(Optional.of(testProject));
        when(technologyRepository.findByNameIgnoreCase("Java")).thenReturn(Optional.of(testTechnology));
        when(roleRepository.save(any(ProjectRole.class))).thenReturn(testProjectRole);

        // When
        ProjectRoleResponse result = projectRoleService.addRoleToProject(projectId, roleRequest, creatorEmail);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getRoleName()).isEqualTo(longRoleName);
    }
} 