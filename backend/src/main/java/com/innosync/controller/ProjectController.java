package com.innosync.controller;

import com.innosync.dto.project.*;
import com.innosync.model.Project;
import com.innosync.model.ProjectTeamMember;
import com.innosync.service.ProjectRoleService;
import com.innosync.service.ProjectService;
import com.innosync.service.ProjectTeamMemberService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.stream.Collectors;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.http.ResponseEntity;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project API", description = "API for project") // Swagger annotation
public class ProjectController {

    private static final Logger logger = LoggerFactory.getLogger(ProjectController.class);

    private final ProjectService projectService;
    private final ProjectRoleService projectRoleService;
    private final ProjectTeamMemberService teamMemberService;

    @GetMapping("/me")
    @Operation(summary = "Show all my projects")
    public List<ProjectResponse> getMyProjects() {
        String email = getCurrentUserEmail();
        logger.info("Fetching projects for user: {}", email);
        return projectService.getMyProjects(email);
    }

    @GetMapping("/joined")
    @Operation(summary = "Show all projects I've joined as a team member")
    public List<ProjectResponse> getJoinedProjects() {
        String email = getCurrentUserEmail();
        logger.info("Fetching joined projects for user: {}", email);
        return projectService.getJoinedProjects(email);
    }

    @PostMapping
    @Operation(summary = "Create a project")
    public ProjectResponse createProject(@RequestBody ProjectRequest request) {
        String email = getCurrentUserEmail();
        logger.info("Received project creation request from user: {}", email);
        try {
            ProjectResponse response = projectService.createProject(request, email);
            logger.info("Project created successfully for user: {}", email);
            return response;
        } catch (Exception e) {
            logger.error("Failed to create project for user: {}", email, e);
            throw e;
        }
    }

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    @PostMapping("/{projectId}/roles")
    @Operation(summary = "Create a role for a project")
    private ProjectRoleResponse addRole(@PathVariable Long projectId, @RequestBody ProjectRoleRequest request) {
        String email = getCurrentUserEmail();
        return projectRoleService.addRoleToProject(projectId, request, email);
    }

    @GetMapping("/{projectId}/roles")
    @Operation(summary = "Get all roles for a project")
    private List<ProjectRoleResponse> getRoles(@PathVariable Long projectId) {
        String email = getCurrentUserEmail();
        return projectRoleService.getRolesByProjectId(projectId);
    }

    @GetMapping("/roles")
    @Operation(summary = "Get all available project roles with project info")
    public List<ProjectRoleWithProjectResponse> getAllRolesWithProjectInfo() {
        return projectRoleService.getAllProjectRolesWithProjectInfo();
    }

    @GetMapping("/{projectId}")
    @Operation(summary = "Get information about a specific project")
    public ProjectResponse getProject(@PathVariable Long projectId) {
        return projectService.getProject(projectId);
    }

    @GetMapping("/{projectId}/team-members")
    @Operation(summary = "Get team members for a project")
    public List<TeamMemberResponse> getTeamMembers(@PathVariable Long projectId) {
        String email = getCurrentUserEmail();
        return teamMemberService.getTeamMembersByProject(projectId).stream()
                .map(this::mapToTeamMemberResponse)
                .collect(Collectors.toList());
    }

    @DeleteMapping("/{projectId}/team-members/{userId}")
    @Operation(summary = "Remove a team member from a project")
    public ResponseEntity<String> removeTeamMember(@PathVariable Long projectId, @PathVariable Long userId) {
        String email = getCurrentUserEmail();

        // Verify the user is the project recruiter
        Project project = projectService.getProjectEntity(projectId);
        if (!project.getRecruiter().getEmail().equals(email)) {
            throw new AccessDeniedException("Only project recruiter can remove team members");
        }

        teamMemberService.removeTeamMemberByProjectAndUser(projectId, userId);
        return ResponseEntity.ok("Team member removed successfully");
    }

    private TeamMemberResponse mapToTeamMemberResponse(ProjectTeamMember teamMember) {
        return TeamMemberResponse.builder()
                .id(teamMember.getId())
                .userId(teamMember.getUser().getId())
                .userName(teamMember.getUser().getFullName())
                .userEmail(teamMember.getUser().getEmail())
                .projectRoleId(teamMember.getProjectRole().getId())
                .roleName(teamMember.getProjectRole().getRoleName())
                .joinedAt(teamMember.getJoinedAt())
                .joinedVia(teamMember.getJoinedVia())
                .build();
    }
}
