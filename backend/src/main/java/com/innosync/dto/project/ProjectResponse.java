package com.innosync.dto.project;

import com.innosync.model.ProjectType;
import com.innosync.model.TeamSize;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class ProjectResponse {
    private Long id;
    private String title;
    private String description;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private ProjectType projectType;
    private TeamSize teamSize;
}
