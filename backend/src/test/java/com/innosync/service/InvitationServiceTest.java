package com.innosync.service;

import com.innosync.dto.project.InvitationRequest;
import com.innosync.dto.project.InvitationResponse;
import com.innosync.model.*;
import com.innosync.repository.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.security.access.AccessDeniedException;

import java.time.LocalDateTime;
import java.util.Arrays;
import java.util.Collections;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.assertj.core.api.Assertions.assertThatThrownBy;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class InvitationServiceTest {

    @Mock
    private InvitationRepository invitationRepository;

    @Mock
    private ProjectRoleRepository projectRoleRepository;

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private InvitationService invitationService;

    private User recruiter;
    private User recipient;
    private ProjectRole projectRole;
    private Project project;
    private Invitation invitation;
    private InvitationRequest invitationRequest;

    @BeforeEach
    void setUp() {
        recruiter = new User("recruiter@example.com", "Recruiter", "password");
        recruiter.setId(1L);

        recipient = new User("developer@example.com", "Developer", "password");
        recipient.setId(2L);

        project = Project.builder()
                .id(1L)
                .title("Test Project")
                .recruiter(recruiter)
                .build();

        projectRole = new ProjectRole();
        projectRole.setId(1L);
        projectRole.setRoleName("Backend Developer");
        projectRole.setProject(project);

        invitation = new Invitation();
        invitation.setId(1L);
        invitation.setSender(recruiter);
        invitation.setRecipient(recipient);
        invitation.setProjectRole(projectRole);
        invitation.setStatus(InvitationStatus.INVITED);
        invitation.setSentAt(LocalDateTime.now());

        invitationRequest = new InvitationRequest();
        invitationRequest.setProjectRoleId(1L);
        invitationRequest.setRecipientId(2L );
    }

    @Test
    void createInvitation_WithValidData_ShouldCreateInvitation() {
        // Given
        String recruiterEmail = "recruiter@example.com";
        
        when(projectRoleRepository.findById(1L)).thenReturn(Optional.of(projectRole));
        when(userRepository.findById(2L)).thenReturn(Optional.of(recipient));
        when(userRepository.findByEmail(recruiterEmail)).thenReturn(Optional.of(recruiter));
        when(invitationRepository.save(any(Invitation.class))).thenReturn(invitation);

        // When
        InvitationResponse result = invitationService.createInvitation(invitationRequest, recruiterEmail);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getId()).isEqualTo(1L);
        assertThat(result.getStatus()).isEqualTo(InvitationStatus.INVITED);

        verify(projectRoleRepository).findById(1L);
        verify(userRepository).findById(2L);
        verify(userRepository).findByEmail(recruiterEmail);
        verify(invitationRepository).save(any(Invitation.class));
    }

    @Test
    void createInvitation_WithNonExistentProjectRole_ShouldThrowException() {
        // Given
        String recruiterEmail = "recruiter@example.com";
        
        when(projectRoleRepository.findById(1L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> invitationService.createInvitation(invitationRequest, recruiterEmail))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Project role not found");

        verify(projectRoleRepository).findById(1L);
        verifyNoInteractions(invitationRepository);
    }

    @Test
    void createInvitation_WithNonExistentRecipient_ShouldThrowException() {
        // Given
        String recruiterEmail = "recruiter@example.com";
        
        when(projectRoleRepository.findById(1L)).thenReturn(Optional.of(projectRole));
        when(invitationRepository.existsByRecipientIdAndProjectRoleIdAndStatus(2L, 1L, InvitationStatus.INVITED))
                .thenReturn(false);
        when(userRepository.findByEmail(recruiterEmail)).thenReturn(Optional.of(recruiter));
        when(userRepository.findById(2L)).thenReturn(Optional.empty());

        // When & Then
        assertThatThrownBy(() -> invitationService.createInvitation(invitationRequest, recruiterEmail))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Recipient user not found");

        verify(projectRoleRepository).findById(1L);
        verify(invitationRepository).existsByRecipientIdAndProjectRoleIdAndStatus(2L, 1L, InvitationStatus.INVITED);
        verify(userRepository).findByEmail(recruiterEmail);
        verify(userRepository).findById(2L);
        verify(invitationRepository, never()).save(any());
    }

    @Test
    void respondToInvitation_WithValidResponse_ShouldUpdateInvitation() {
        // Given
        Long invitationId = 1L;
        String userEmail = "developer@example.com";
        InvitationStatus response = InvitationStatus.ACCEPTED;
        
        invitation.setStatus(InvitationStatus.INVITED); // Initial status
        Invitation updatedInvitation = new Invitation();
        updatedInvitation.setId(1L);
        updatedInvitation.setStatus(InvitationStatus.ACCEPTED);
        updatedInvitation.setRespondedAt(LocalDateTime.now());
        updatedInvitation.setSender(recruiter);
        updatedInvitation.setRecipient(recipient);
        updatedInvitation.setProjectRole(projectRole);

        when(invitationRepository.findById(invitationId)).thenReturn(Optional.of(invitation));
        when(invitationRepository.save(any(Invitation.class))).thenReturn(updatedInvitation);

        // When
        InvitationResponse result = invitationService.respondToInvitation(invitationId, response, userEmail);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getStatus()).isEqualTo(InvitationStatus.ACCEPTED);
        assertThat(invitation.getRespondedAt()).isNotNull();

        verify(invitationRepository).findById(invitationId);
        verify(invitationRepository).save(invitation);
    }

    @Test
    void respondToInvitation_WithUnauthorizedUser_ShouldThrowAccessDeniedException() {
        // Given
        Long invitationId = 1L;
        String unauthorizedEmail = "other@example.com";
        InvitationStatus response = InvitationStatus.ACCEPTED;

        when(invitationRepository.findById(invitationId)).thenReturn(Optional.of(invitation));

        // When & Then
        assertThatThrownBy(() -> invitationService.respondToInvitation(invitationId, response, unauthorizedEmail))
                .isInstanceOf(AccessDeniedException.class)
                .hasMessage("Only the invited user can respond");

        verify(invitationRepository).findById(invitationId);
        verify(invitationRepository, never()).save(any());
    }

    @Test
    void respondToInvitation_WithAlreadyRespondedInvitation_ShouldThrowException() {
        // Given
        Long invitationId = 1L;
        String userEmail = "developer@example.com";
        InvitationStatus response = InvitationStatus.ACCEPTED;
        
        invitation.setStatus(InvitationStatus.ACCEPTED); // Already responded

        when(invitationRepository.findById(invitationId)).thenReturn(Optional.of(invitation));

        // When & Then
        assertThatThrownBy(() -> invitationService.respondToInvitation(invitationId, response, userEmail))
                .isInstanceOf(RuntimeException.class)
                .hasMessage("Invitation already responded to");

        verify(invitationRepository).findById(invitationId);
        verify(invitationRepository, never()).save(any());
    }

    @Test
    void getSentInvitations_WithValidRecruiter_ShouldReturnInvitations() {
        // Given
        String recruiterEmail = "recruiter@example.com";
        List<Invitation> invitations = Arrays.asList(invitation);

        when(userRepository.findByEmail(recruiterEmail)).thenReturn(Optional.of(recruiter));
        when(invitationRepository.findBySenderId(recruiter.getId())).thenReturn(invitations);

        // When
        List<InvitationResponse> result = invitationService.getSentInvitations(recruiterEmail);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);

        verify(userRepository).findByEmail(recruiterEmail);
        verify(invitationRepository).findBySenderId(recruiter.getId());
    }

    @Test
    void getReceivedInvitations_WithValidUser_ShouldReturnInvitations() {
        // Given
        String userEmail = "developer@example.com";
        List<Invitation> invitations = Arrays.asList(invitation);

        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(recipient));
        when(invitationRepository.findByRecipientId(recipient.getId())).thenReturn(invitations);

        // When
        List<InvitationResponse> result = invitationService.getReceivedInvitations(userEmail);

        // Then
        assertThat(result).hasSize(1);
        assertThat(result.get(0).getId()).isEqualTo(1L);

        verify(userRepository).findByEmail(userEmail);
        verify(invitationRepository).findByRecipientId(recipient.getId());
    }

    @Test
    void getReceivedInvitations_WithNoInvitations_ShouldReturnEmptyList() {
        // Given
        String userEmail = "developer@example.com";

        when(userRepository.findByEmail(userEmail)).thenReturn(Optional.of(recipient));
        when(invitationRepository.findByRecipientId(recipient.getId())).thenReturn(Collections.emptyList());

        // When
        List<InvitationResponse> result = invitationService.getReceivedInvitations(userEmail);

        // Then
        assertThat(result).isEmpty();

        verify(userRepository).findByEmail(userEmail);
        verify(invitationRepository).findByRecipientId(recipient.getId());
    }
} 