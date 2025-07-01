package com.innosync.dto.project;

import com.innosync.model.ProjectType;
import com.innosync.model.TeamSize;
import lombok.Data;

@Data
public class ProjectRequest {
    private String title;
    private String description;
    private ProjectType projectType;
    private TeamSize teamSize;
}
