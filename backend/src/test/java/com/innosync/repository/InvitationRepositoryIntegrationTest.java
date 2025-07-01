package com.innosync.repository;

import com.innosync.model.*;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@Import(com.innosync.config.TestContainersConfig.class)
class InvitationRepositoryIntegrationTest {

    @Autowired
    private InvitationRepository invitationRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProjectRepository projectRepository;

    @Autowired
    private ProjectRoleRepository projectRoleRepository;

    private User recruiter;
    private User developer1;
    private User developer2;
    private Project project;
    private ProjectRole frontendRole;
    private ProjectRole backendRole;

    @BeforeEach
    void setUp() {
        // Clean database
        invitationRepository.deleteAll();
        projectRoleRepository.deleteAll();
        projectRepository.deleteAll();
        userRepository.deleteAll();

        // Create test users
        recruiter = new User("recruiter@example.com", "Tech Recruiter", "password123");
        developer1 = new User("dev1@example.com", "Frontend Developer", "password123");
        developer2 = new User("dev2@example.com", "Backend Developer", "password123");
        userRepository.saveAll(List.of(recruiter, developer1, developer2));

        // Create test project
        project = Project.builder()
                .title("E-commerce Platform")
                .description("Building a modern e-commerce platform")
                .recruiter(recruiter)
                .projectType(ProjectType.FREELANCE)
                .teamSize(TeamSize.FourSix)
                .build();
        projectRepository.save(project);

        // Create test project roles
        frontendRole = new ProjectRole();
        frontendRole.setProject(project);
        frontendRole.setRoleName("Frontend Developer");
        frontendRole.setExpertiseLevel(ExpertiseLevel.MID);

        backendRole = new ProjectRole();
        backendRole.setProject(project);
        backendRole.setRoleName("Backend Developer");
        backendRole.setExpertiseLevel(ExpertiseLevel.SENIOR);

        projectRoleRepository.saveAll(List.of(frontendRole, backendRole));
    }

    @Test
    void save_WithValidInvitation_ShouldPersistInvitation() {
        // Given
        LocalDateTime sentTime = LocalDateTime.now();
        Invitation invitation = new Invitation();
        invitation.setProjectRole(frontendRole);
        invitation.setSender(recruiter);
        invitation.setRecipient(developer1);
        invitation.setStatus(InvitationStatus.INVITED);
        invitation.setSentAt(sentTime);

        // When
        Invitation savedInvitation = invitationRepository.save(invitation);

        // Then
        assertThat(savedInvitation.getId()).isNotNull();
        assertThat(savedInvitation.getProjectRole().getId()).isEqualTo(frontendRole.getId());
        assertThat(savedInvitation.getSender().getId()).isEqualTo(recruiter.getId());
        assertThat(savedInvitation.getRecipient().getId()).isEqualTo(developer1.getId());
        assertThat(savedInvitation.getStatus()).isEqualTo(InvitationStatus.INVITED);
        assertThat(savedInvitation.getSentAt()).isEqualTo(sentTime);
        assertThat(savedInvitation.getRespondedAt()).isNull();
    }

    @Test
    void findByProjectRoleId_WithExistingInvitations_ShouldReturnInvitationsForRole() {
        // Given
        Invitation invitation1 = createInvitation(frontendRole, recruiter, developer1, InvitationStatus.INVITED);
        Invitation invitation2 = createInvitation(frontendRole, recruiter, developer2, InvitationStatus.ACCEPTED);
        Invitation invitation3 = createInvitation(backendRole, recruiter, developer1, InvitationStatus.INVITED);
        
        invitationRepository.saveAll(List.of(invitation1, invitation2, invitation3));

        // When
        List<Invitation> frontendInvitations = invitationRepository.findByProjectRoleId(frontendRole.getId());
        List<Invitation> backendInvitations = invitationRepository.findByProjectRoleId(backendRole.getId());

        // Then
        assertThat(frontendInvitations).hasSize(2);
        assertThat(frontendInvitations).extracting(inv -> inv.getRecipient().getEmail())
                .containsExactlyInAnyOrder("dev1@example.com", "dev2@example.com");

        assertThat(backendInvitations).hasSize(1);
        assertThat(backendInvitations.get(0).getRecipient().getEmail()).isEqualTo("dev1@example.com");
    }

    @Test
    void findByRecipientId_WithExistingInvitations_ShouldReturnInvitationsForRecipient() {
        // Given
        Invitation invitation1 = createInvitation(frontendRole, recruiter, developer1, InvitationStatus.INVITED);
        Invitation invitation2 = createInvitation(backendRole, recruiter, developer1, InvitationStatus.ACCEPTED);
        Invitation invitation3 = createInvitation(frontendRole, recruiter, developer2, InvitationStatus.DECLINED);
        
        invitationRepository.saveAll(List.of(invitation1, invitation2, invitation3));

        // When
        List<Invitation> dev1Invitations = invitationRepository.findByRecipientId(developer1.getId());
        List<Invitation> dev2Invitations = invitationRepository.findByRecipientId(developer2.getId());

        // Then
        assertThat(dev1Invitations).hasSize(2);
        assertThat(dev1Invitations).extracting(inv -> inv.getProjectRole().getRoleName())
                .containsExactlyInAnyOrder("Frontend Developer", "Backend Developer");

        assertThat(dev2Invitations).hasSize(1);
        assertThat(dev2Invitations.get(0).getStatus()).isEqualTo(InvitationStatus.DECLINED);
    }

    @Test
    void findBySenderId_WithExistingInvitations_ShouldReturnInvitationsFromSender() {
        // Given
        Invitation invitation1 = createInvitation(frontendRole, recruiter, developer1, InvitationStatus.INVITED);
        Invitation invitation2 = createInvitation(backendRole, recruiter, developer2, InvitationStatus.ACCEPTED);
        
        invitationRepository.saveAll(List.of(invitation1, invitation2));

        // When
        List<Invitation> recruiterInvitations = invitationRepository.findBySenderId(recruiter.getId());

        // Then
        assertThat(recruiterInvitations).hasSize(2);
        assertThat(recruiterInvitations).extracting(inv -> inv.getSender().getEmail())
                .containsOnly("recruiter@example.com");
    }

    @Test
    void findByRecipientIdAndProjectRoleId_WithExistingInvitation_ShouldReturnInvitation() {
        // Given
        Invitation invitation = createInvitation(frontendRole, recruiter, developer1, InvitationStatus.INVITED);
        invitationRepository.save(invitation);

        // When
        Optional<Invitation> result = invitationRepository.findByRecipientIdAndProjectRoleId(
                developer1.getId(), frontendRole.getId());

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getRecipient().getId()).isEqualTo(developer1.getId());
        assertThat(result.get().getProjectRole().getId()).isEqualTo(frontendRole.getId());
    }

    @Test
    void findByRecipientIdAndProjectRoleId_WithNonExistentInvitation_ShouldReturnEmpty() {
        // When
        Optional<Invitation> result = invitationRepository.findByRecipientIdAndProjectRoleId(
                developer1.getId(), frontendRole.getId());

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void existsByRecipientIdAndProjectRoleIdAndStatus_WithMatchingInvitation_ShouldReturnTrue() {
        // Given
        Invitation invitation = createInvitation(frontendRole, recruiter, developer1, InvitationStatus.INVITED);
        invitationRepository.save(invitation);

        // When
        boolean exists = invitationRepository.existsByRecipientIdAndProjectRoleIdAndStatus(
                developer1.getId(), frontendRole.getId(), InvitationStatus.INVITED);
        boolean notExists = invitationRepository.existsByRecipientIdAndProjectRoleIdAndStatus(
                developer1.getId(), frontendRole.getId(), InvitationStatus.ACCEPTED);

        // Then
        assertThat(exists).isTrue();
        assertThat(notExists).isFalse();
    }

    @Test
    void save_WithInvitationStatusUpdate_ShouldUpdateStatusAndTimestamp() {
        // Given
        Invitation invitation = createInvitation(frontendRole, recruiter, developer1, InvitationStatus.INVITED);
        Invitation savedInvitation = invitationRepository.save(invitation);
        assertThat(savedInvitation.getRespondedAt()).isNull();

        // When
        LocalDateTime responseTime = LocalDateTime.now();
        savedInvitation.setStatus(InvitationStatus.ACCEPTED);
        savedInvitation.setRespondedAt(responseTime);
        Invitation updatedInvitation = invitationRepository.save(savedInvitation);

        // Then
        assertThat(updatedInvitation.getStatus()).isEqualTo(InvitationStatus.ACCEPTED);
        assertThat(updatedInvitation.getRespondedAt()).isEqualTo(responseTime);
    }

    @Test
    void save_WithAllInvitationStatuses_ShouldHandleAllEnumValues() {
        // Test each InvitationStatus enum value
        InvitationStatus[] statuses = {
                InvitationStatus.INVITED, InvitationStatus.ACCEPTED, InvitationStatus.DECLINED,
                InvitationStatus.REVOKED, InvitationStatus.PENDING, InvitationStatus.EXPIRED
        };

        for (InvitationStatus status : statuses) {
            // Given
            Invitation invitation = createInvitation(frontendRole, recruiter, developer1, status);

            // When
            Invitation savedInvitation = invitationRepository.save(invitation);

            // Then
            assertThat(savedInvitation.getStatus()).isEqualTo(status);

            // Clean up for next iteration
            invitationRepository.delete(savedInvitation);
        }
    }

    @Test
    void delete_ExistingInvitation_ShouldRemoveFromDatabase() {
        // Given
        Invitation invitation = createInvitation(frontendRole, recruiter, developer1, InvitationStatus.INVITED);
        Invitation savedInvitation = invitationRepository.save(invitation);
        Long invitationId = savedInvitation.getId();

        // When
        invitationRepository.deleteById(invitationId);

        // Then
        Optional<Invitation> result = invitationRepository.findById(invitationId);
        assertThat(result).isEmpty();
        
        // Verify related entities still exist (no cascade delete)
        assertThat(userRepository.findById(recruiter.getId())).isPresent();
        assertThat(userRepository.findById(developer1.getId())).isPresent();
        assertThat(projectRoleRepository.findById(frontendRole.getId())).isPresent();
    }

    @Test
    void findAll_WithComplexRelationships_ShouldLoadAllAssociations() {
        // Given
        Invitation invitation1 = createInvitation(frontendRole, recruiter, developer1, InvitationStatus.INVITED);
        Invitation invitation2 = createInvitation(backendRole, recruiter, developer2, InvitationStatus.ACCEPTED);
        invitationRepository.saveAll(List.of(invitation1, invitation2));

        // When
        List<Invitation> allInvitations = invitationRepository.findAll();

        // Then
        assertThat(allInvitations).hasSize(2);
        
        for (Invitation invitation : allInvitations) {
            // Verify all relationships are properly loaded
            assertThat(invitation.getProjectRole()).isNotNull();
            assertThat(invitation.getProjectRole().getProject()).isNotNull();
            assertThat(invitation.getProjectRole().getProject().getTitle()).isEqualTo("E-commerce Platform");
            assertThat(invitation.getSender()).isNotNull();
            assertThat(invitation.getSender().getEmail()).isEqualTo("recruiter@example.com");
            assertThat(invitation.getRecipient()).isNotNull();
            assertThat(invitation.getRecipient().getEmail()).isIn("dev1@example.com", "dev2@example.com");
        }
    }

    private Invitation createInvitation(ProjectRole projectRole, User sender, User recipient, InvitationStatus status) {
        Invitation invitation = new Invitation();
        invitation.setProjectRole(projectRole);
        invitation.setSender(sender);
        invitation.setRecipient(recipient);
        invitation.setStatus(status);
        invitation.setSentAt(LocalDateTime.now());
        return invitation;
    }
} 