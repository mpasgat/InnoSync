package com.innosync.service;

import com.innosync.dto.project.InvitationRequest;
import com.innosync.dto.project.InvitationResponse;
import com.innosync.model.*;
import com.innosync.repository.*;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.time.LocalDateTime;
import java.util.Comparator;
import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class InvitationService {
    private final InvitationRepository invitationRepository;
    private final ProjectRoleRepository projectRoleRepository;
    private final UserRepository userRepository;

    @Transactional
    public InvitationResponse createInvitation(InvitationRequest request, String recruiterEmail) {
        Long projectRoleId = request.getProjectRoleId();
        Long recipientId = request.getRecipientId();

        if (projectRoleId == null || recipientId == null || recruiterEmail == null || recruiterEmail.isBlank()) {
            throw new IllegalArgumentException("Missing required parameters");
        }

        ProjectRole role = projectRoleRepository.findById(projectRoleId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Project role not found"));

        if (!role.getProject().getRecruiter().getEmail().equals(recruiterEmail)) {
            throw new AccessDeniedException("Only project recruiter can send invitations");
        }

        if (invitationRepository.existsByRecipientIdAndProjectRoleIdAndStatus(
                recipientId, projectRoleId, InvitationStatus.INVITED)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Invitation already exists");
        }

        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recruiter not found"));

        User recipient = userRepository.findById(recipientId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recipient user not found"));

        Invitation invitation = new Invitation();
        invitation.setProjectRole(role);
        invitation.setSender(recruiter);
        invitation.setRecipient(recipient);
        invitation.setStatus(InvitationStatus.INVITED);
        invitation.setSentAt(LocalDateTime.now());

        Invitation saved = invitationRepository.save(invitation);
        return mapToResponse(saved);
    }

    @Transactional
    public InvitationResponse respondToInvitation(Long invitationId, InvitationStatus response, String userEmail) {
        Invitation invitation = invitationRepository.findById(invitationId)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Invitation not found"));

        if (!invitation.getRecipient().getEmail().equals(userEmail)) {
            throw new AccessDeniedException("Only the invited user can respond");
        }

        if (invitation.getStatus() != InvitationStatus.INVITED) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Invitation already responded to");
        }

        invitation.setStatus(response);
        invitation.setRespondedAt(LocalDateTime.now());

        return mapToResponse(invitationRepository.save(invitation));
    }

    public List<InvitationResponse> getSentInvitations(String recruiterEmail) {
        User recruiter = userRepository.findByEmail(recruiterEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "Recruiter not found"));

        return invitationRepository.findBySenderId(recruiter.getId()).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    public List<InvitationResponse> getReceivedInvitations(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.NOT_FOUND, "User not found"));

        return invitationRepository.findByRecipientId(user.getId()).stream()
                .map(this::mapToResponse)
                .sorted(Comparator.comparing(InvitationResponse::getSentAt).reversed())
                .collect(Collectors.toList());
    }

    private InvitationResponse mapToResponse(Invitation invitation) {
        return InvitationResponse.builder()
                .id(invitation.getId())
                .projectRoleId(invitation.getProjectRole().getId())
                .roleName(invitation.getProjectRole().getRoleName())
                .projectId(invitation.getProjectRole().getProject().getId())
                .projectTitle(invitation.getProjectRole().getProject().getTitle())
                .recipientId(invitation.getRecipient().getId())
                .recipientName(invitation.getRecipient().getFullName())
                .senderId(invitation.getSender().getId())
                .senderName(invitation.getSender().getFullName())
                .senderEmail(invitation.getSender().getEmail())
                .status(invitation.getStatus())
                .sentAt(invitation.getSentAt())
                .respondedAt(invitation.getRespondedAt())
                .build();
    }
}
