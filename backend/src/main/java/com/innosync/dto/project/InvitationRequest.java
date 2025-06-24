package com.innosync.dto.project;

import lombok.Data;

@Data
public class InvitationRequest {
    private Long projectRoleId;
    private Long recipientId;
}
