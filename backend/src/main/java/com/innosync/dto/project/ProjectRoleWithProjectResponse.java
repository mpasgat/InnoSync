package com.innosync.dto.project;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProjectRoleWithProjectResponse {
    private Long roleId;
    private String roleName;
//    private String roleDescription;

    private Long projectId;
    private String projectTitle;
    private String projectDescription;
}