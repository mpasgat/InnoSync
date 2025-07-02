package com.innosync.controller;

import com.innosync.dto.project.*;
import com.innosync.service.ProjectRoleService;
import com.innosync.service.ProjectService;
import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.tags.Tag;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
@Tag(name = "Project API", description = "API for project") // Swagger annotation
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectRoleService projectRoleService;

    @GetMapping("/me")
    @Operation(summary = "Show all my projects")
    public List<ProjectResponse> getMyProjects() {
        String email = getCurrentUserEmail();
        return projectService.getMyProjects(email);
    }

    @PostMapping
    @Operation(summary = "Create a project")
    public ProjectResponse createProject(@RequestBody ProjectRequest request) {
        String email = getCurrentUserEmail();
        return projectService.createProject(request, email);
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
}
