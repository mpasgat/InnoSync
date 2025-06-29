package com.innosync.controller;

import com.innosync.dto.project.InvitationRequest;
import com.innosync.dto.project.InvitationResponse;
import com.innosync.model.InvitationStatus;
import com.innosync.service.InvitationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/invitations")
@RequiredArgsConstructor
@Tag(name = "Invitation API", description = "API for user invitations")
public class InvitationController {
    private final InvitationService invitationService;

    @PostMapping
    @Operation(summary = "Create invitation")
    public ResponseEntity<InvitationResponse> createInvitation(
            @RequestBody InvitationRequest request,
            Authentication authentication) {
        return ResponseEntity.ok(
                invitationService.createInvitation(request, authentication.getName())
        );
    }

    @PatchMapping("/{invitationId}/respond")
    @Operation(summary = "Respond to invitation")
    public ResponseEntity<InvitationResponse> respondToInvitation(
            @PathVariable Long invitationId,
            @RequestParam InvitationStatus response,
            Authentication authentication) {
        return ResponseEntity.ok(
                invitationService.respondToInvitation(invitationId, response, authentication.getName())
        );
    }

    @GetMapping("/sent")
    @Operation(summary = "Show all sent invitations")
    public ResponseEntity<List<InvitationResponse>> getSentInvitations(Authentication authentication) {
        return ResponseEntity.ok(
                invitationService.getSentInvitations(authentication.getName())
        );
    }

    @GetMapping("/received")
    @Operation(summary = "Show all received invitations")
    public ResponseEntity<List<InvitationResponse>> getReceivedInvitations(Authentication authentication) {
        return ResponseEntity.ok(
                invitationService.getReceivedInvitations(authentication.getName())
        );
    }
}
