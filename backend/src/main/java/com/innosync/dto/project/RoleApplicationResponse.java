package com.innosync.dto.project;

import com.innosync.model.ApplicationStatus;
import com.innosync.model.ProjectType;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RoleApplicationResponse {
    private Long id;
    private Long userId;
    private String userFullName;
    private Long projectRoleId;
    private String roleName;
    private Long projectId;
    private String projectTitle;
    private ProjectType projectType;
    private ApplicationStatus status;
    private LocalDateTime appliedAt;
    private LocalDateTime updatedAt;
}