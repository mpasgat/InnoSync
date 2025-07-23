package com.innosync.dto.project;

import com.innosync.model.ProjectTeamMember;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class TeamMemberResponse {
    private Long id;
    private Long userId;
    private String userName;
    private String userEmail;
    private Long projectRoleId;
    private String roleName;
    private LocalDateTime joinedAt;
    private ProjectTeamMember.JoinMethod joinedVia;
}