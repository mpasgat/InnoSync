package com.innosync.controller;

import com.innosync.dto.project.ProjectRequest;
import com.innosync.dto.project.ProjectResponse;
import com.innosync.dto.project.ProjectRoleRequest;
import com.innosync.dto.project.ProjectRoleResponse;
import com.innosync.service.ProjectRoleService;
import com.innosync.service.ProjectService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@RequiredArgsConstructor
public class ProjectController {

    private final ProjectService projectService;
    private final ProjectRoleService projectRoleService;

    @GetMapping("/me")
    public List<ProjectResponse> getMyProjects() {
        String email = getCurrentUserEmail();
        return projectService.getMyProjects(email);
    }

    @PostMapping
    public ProjectResponse createProject(@RequestBody ProjectRequest request) {
        String email = getCurrentUserEmail();
        return projectService.createProject(request, email);
    }

    private String getCurrentUserEmail() {
        Authentication auth = SecurityContextHolder.getContext().getAuthentication();
        return auth.getName();
    }

    @PostMapping("/{projectId}/roles")
    private ProjectRoleResponse addRole(@PathVariable Long projectId, @RequestBody ProjectRoleRequest request) {
        String email = getCurrentUserEmail();
        return projectRoleService.addRoleToProject(projectId, request, email);
    }

    @GetMapping("/{projectId}/roles")
    private List<ProjectRoleResponse> getRoles(@PathVariable Long projectId) {
        String email = getCurrentUserEmail();
        return projectRoleService.getRolesByProjectId(projectId);
    }
}
