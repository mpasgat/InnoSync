package com.innosync.controller;

import com.innosync.dto.project.RoleApplicationResponse;
import com.innosync.model.ApplicationStatus;
import com.innosync.service.RoleApplicationService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/applications")
@RequiredArgsConstructor
@Tag(name = "Role applicatoin API", description = "API for role application") // Swagger annotation
public class RoleApplicationController {
    private final RoleApplicationService roleApplicationService;

    @PostMapping("/project-roles/{projectRoleId}")
    @Operation(summary = "Create role application")
    public ResponseEntity<RoleApplicationResponse> createApplication(@PathVariable Long projectRoleId, Authentication authentication) {
        return ResponseEntity.ok(
                roleApplicationService.createApplication(projectRoleId, authentication.getName())
        );
    }


    @PatchMapping("/{applicationId}/status")
    @Operation(summary = "Respond to role application")
    public ResponseEntity<RoleApplicationResponse> updateApplicationStatus(
            @PathVariable Long applicationId,
            @RequestParam ApplicationStatus status,
            Authentication authentication) {
        return ResponseEntity.ok(
                roleApplicationService.updateApplicationStatus(applicationId, status, authentication.getName())
        );
    }

    @GetMapping("/project-roles/{projectRoleId}")
    @Operation(summary = "Show all applications to role")
    public ResponseEntity<List<RoleApplicationResponse>> getApplicationsForRole(
            @PathVariable Long projectRoleId,
            Authentication authentication) {
        // Add authorization check
        return ResponseEntity.ok(roleApplicationService.getApplicationsForRole(projectRoleId, authentication.getName()));
    }

    @GetMapping
    @Operation(summary = "Show all applications sent by current user")
    public ResponseEntity<List<RoleApplicationResponse>> getMyApplications(Authentication authentication) {
        return ResponseEntity.ok(
                roleApplicationService.getApplicationsByUser(authentication.getName())
        );
    }


}
