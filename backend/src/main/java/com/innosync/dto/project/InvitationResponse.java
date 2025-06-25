package com.innosync.dto.project;

import com.innosync.model.InvitationStatus;
import lombok.Builder;
import lombok.Data;

import java.time.LocalDateTime;

@Data
@Builder
public class InvitationResponse {
    private Long id;
    private Long projectRoleId;
    private String roleName;
    private Long projectId;
    private String projectTitle;
    private Long recipientId;
    private String recipientName;
    private InvitationStatus status;
    private LocalDateTime sentAt;
    private LocalDateTime respondedAt;
}
