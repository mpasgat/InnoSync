package com.innosync.service;

import com.innosync.dto.project.ProjectRequest;
import com.innosync.dto.project.ProjectResponse;
import com.innosync.dto.project.ProjectRoleResponse;
import com.innosync.model.Project;
import com.innosync.model.User;
import com.innosync.repository.ProjectRepository;
import com.innosync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;

    public ProjectResponse createProject(ProjectRequest request, String email) {
        User recruiter =  userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .recruiter(recruiter)
                .build();

        Project saved = projectRepository.save(project);

        return mapToDTO(saved);
    }

    public List<ProjectResponse> getMyProjects(String email) {
        User recruiter =  userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return projectRepository.findByRecruiter(recruiter)
                .stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    public ProjectResponse getProject(Long id) {
        Project project = projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found"));

        return mapToDTO(project);
    }

    private ProjectResponse mapToDTO(Project project) {
        ProjectResponse dto = new ProjectResponse();
        dto.setId(project.getId());
        dto.setTitle(project.getTitle());
        dto.setDescription(project.getDescription());
        dto.setCreatedAt(project.getCreatedAt());
        dto.setUpdatedAt(project.getUpdatedAt());
        return dto;
    }
}
