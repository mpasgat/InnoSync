package com.innosync.controller;

import com.innosync.dto.ProjectRequest;
import com.innosync.dto.ProjectResponse;
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
}
