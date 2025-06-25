package com.innosync.dto.project;

import com.innosync.model.ExpertiseLevel;
import lombok.Data;

import java.util.List;

@Data
public class ProjectRoleResponse {
    private Long id;
    private String roleName;
    private ExpertiseLevel expertiseLevel;
    private List<String> technologies;
}