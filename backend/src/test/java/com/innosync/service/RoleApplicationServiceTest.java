package com.innosync.service;

import com.innosync.dto.project.RoleApplicationResponse;
import com.innosync.model.*;
import com.innosync.repository.ProjectRoleRepository;
import com.innosync.repository.RoleApplicationRepository;
import com.innosync.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RoleApplicationServiceTest {

    @Mock
    private RoleApplicationRepository applicationRepository;

    @Mock
    private ProjectRoleRepository projectRoleRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private RoleApplicationService roleApplicationService;

    private User applicant;
    private User projectOwner;
    private Project project;
    private ProjectRole projectRole;
    private RoleApplication roleApplication;

    @BeforeEach
    void setUp() {
        applicant = new User("applicant@example.com", "Applicant", "password");
        applicant.setId(1L);

        projectOwner = new User("owner@example.com", "Project Owner", "password");
        projectOwner.setId(2L);

        project = Project.builder()
                .id(1L)
                .title("Test Project")
                .projectType(ProjectType.FREELANCE)
                .recruiter(projectOwner)
                .build();

        projectRole = new ProjectRole();
        projectRole.setId(1L);
        projectRole.setRoleName("Backend Developer");
        projectRole.setProject(project);

        roleApplication = new RoleApplication();
        roleApplication.setId(1L);
        roleApplication.setUser(applicant);
        roleApplication.setProjectRole(projectRole);
        roleApplication.setStatus(ApplicationStatus.PENDING);
        roleApplication.setAppliedAt(LocalDateTime.now());
    }

    @Test
    void createApplication_WithValidData_ShouldCreateApplication() {
        // Given
        Long projectRoleId = 1L;
        String userEmail = "applicant@example.com";

        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(applicant));
        when(projectRoleRepository.findById(projectRoleId)).thenReturn(Optional.of(projectRole));
        when(applicationRepository.existsByUserIdAndProjectRoleId(applicant.getId(), projectRoleId))
                .thenReturn(false);
        when(applicationRepository.save(any(RoleApplication.class))).thenReturn(roleApplication);

        // When
        RoleApplicationResponse result = roleApplicationService.createApplication(projectRoleId, userEmail);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getStatus()).isEqualTo(ApplicationStatus.PENDING);
        assertThat(result.getProjectType()).isEqualTo(ProjectType.FREELANCE);

        verify(userRepository).findByEmail(userEmail);
        verify(projectRoleRepository).findById(projectRoleId);
        verify(applicationRepository).existsByUserIdAndProjectRoleId(applicant.getId(), projectRoleId);
        verify(applicationRepository).save(any(RoleApplication.class));
    }

    @Test
    void createApplication_WithNonExistentUser_ShouldThrowException() {
        // Given
        Long projectRoleId = 1L;
        String userEmail = "nonexistent@example.com";

        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> roleApplicationService.createApplication(projectRoleId, userEmail))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("User not found");

        verify(userRepository).findByEmail(userEmail);
        verifyNoInteractions(applicationRepository);
    }

    @Test
    void createApplication_WithNonExistentProjectRole_ShouldThrowException() {
        // Given
        Long projectRoleId = 999L;
        String userEmail = "applicant@example.com";

        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(applicant));
        when(projectRoleRepository.findById(projectRoleId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> roleApplicationService.createApplication(projectRoleId, userEmail))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Project role not found");

        verify(userRepository).findByEmail(userEmail);
        verify(projectRoleRepository).findById(projectRoleId);
        verifyNoInteractions(applicationRepository);
    }

    @Test
    void createApplication_WithExistingApplication_ShouldThrowException() {
        // Given
        Long projectRoleId = 1L;
        String userEmail = "applicant@example.com";

        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(applicant));
        when(projectRoleRepository.findById(projectRoleId)).thenReturn(Optional.of(projectRole));
        when(applicationRepository.existsByUserIdAndProjectRoleId(applicant.getId(), projectRoleId))
                .thenReturn(true);

        // When & Then
        assertThatThrownBy(() -> roleApplicationService.createApplication(projectRoleId, userEmail))
                .isInstanceOf(IllegalStateException.class)
                .hasMessage("You have already applied to this role");

        verify(userRepository).findByEmail(userEmail);
        verify(projectRoleRepository).findById(projectRoleId);
        verify(applicationRepository).existsByUserIdAndProjectRoleId(applicant.getId(), projectRoleId);
        verify(applicationRepository, never()).save(any());
    }

    @Test
    void updateApplicationStatus_WithValidData_ShouldUpdateStatus() {
        // Given
        Long applicationId = 1L;
        ApplicationStatus newStatus = ApplicationStatus.ACCEPTED;
        String recruiterEmail = "owner@example.com";

        RoleApplication updatedApplication = new RoleApplication();
        updatedApplication.setId(1L);
        updatedApplication.setStatus(ApplicationStatus.ACCEPTED);
        updatedApplication.setUser(applicant);
        updatedApplication.setProjectRole(projectRole);
        updatedApplication.setAppliedAt(LocalDateTime.now());

        when(applicationRepository.findById(applicationId)).thenReturn(Optional.of(roleApplication));
        when(applicationRepository.save(any(RoleApplication.class))).thenReturn(updatedApplication);

        // When
        RoleApplicationResponse result = roleApplicationService.updateApplicationStatus(
                applicationId, newStatus, recruiterEmail);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(ApplicationStatus.ACCEPTED);
        assertThat(roleApplication.getStatus()).isEqualTo(ApplicationStatus.ACCEPTED);

        verify(applicationRepository).findById(applicationId);
        verify(applicationRepository).save(roleApplication);
    }

    @Test
    void updateApplicationStatus_WithNonExistentApplication_ShouldThrowException() {
        // Given
        Long applicationId = 999L;
        ApplicationStatus newStatus = ApplicationStatus.ACCEPTED;
        String recruiterEmail = "owner@example.com";

        when(applicationRepository.findById(applicationId)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> roleApplicationService.updateApplicationStatus(
                applicationId, newStatus, recruiterEmail))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Application not found");

        verify(applicationRepository).findById(applicationId);
        verify(applicationRepository, never()).save(any());
    }

    @Test
    void updateApplicationStatus_WithUnauthorizedUser_ShouldThrowAccessDeniedException() {
        // Given
        Long applicationId = 1L;
        ApplicationStatus newStatus = ApplicationStatus.ACCEPTED;
        String unauthorizedEmail = "unauthorized@example.com";

        when(applicationRepository.findById(applicationId)).thenReturn(Optional.of(roleApplication));

        // When & Then
        assertThatThrownBy(() -> roleApplicationService.updateApplicationStatus(
                applicationId, newStatus, unauthorizedEmail))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("Only project recruiter can update application status");

        verify(applicationRepository).findById(applicationId);
        verify(applicationRepository, never()).save(any());
    }

    @Test
    void createApplication_WithDifferentApplicationStatuses_ShouldSetPending() {
        // Given
        Long projectRoleId = 1L;
        String userEmail = "applicant@example.com";

        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(applicant));
        when(projectRoleRepository.findById(projectRoleId)).thenReturn(Optional.of(projectRole));
        when(applicationRepository.existsByUserIdAndProjectRoleId(applicant.getId(), projectRoleId))
                .thenReturn(false);
        when(applicationRepository.save(any(RoleApplication.class))).thenReturn(roleApplication);

        // When
        RoleApplicationResponse result = roleApplicationService.createApplication(projectRoleId, userEmail);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(ApplicationStatus.PENDING);
        assertThat(result.getAppliedAt()).isNotNull();
    }

    @Test
    void updateApplicationStatus_WithDifferentStatuses_ShouldUpdateCorrectly() {
        // Given
        Long applicationId = 1L;
        String recruiterEmail = "owner@example.com";

        when(applicationRepository.findById(applicationId)).thenReturn(Optional.of(roleApplication));

        // Test REJECTED status
        ApplicationStatus rejectedStatus = ApplicationStatus.REJECTED;
        RoleApplication rejectedApplication = new RoleApplication();
        rejectedApplication.setId(1L);
        rejectedApplication.setStatus(ApplicationStatus.REJECTED);
        rejectedApplication.setUser(applicant);
        rejectedApplication.setProjectRole(projectRole);
        rejectedApplication.setAppliedAt(LocalDateTime.now());
        when(applicationRepository.save(any(RoleApplication.class))).thenReturn(rejectedApplication);

        // When
        RoleApplicationResponse result = roleApplicationService.updateApplicationStatus(
                applicationId, rejectedStatus, recruiterEmail);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(ApplicationStatus.REJECTED);
        assertThat(roleApplication.getStatus()).isEqualTo(ApplicationStatus.REJECTED);
    }
} 