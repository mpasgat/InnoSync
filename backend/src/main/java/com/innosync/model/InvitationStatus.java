package com.innosync.model;

public enum InvitationStatus {
    INVITED,     // Initial status when invitation is sent
    ACCEPTED,    // When user accepts the invitation
    DECLINED,    // When user declines the invitation
    REVOKED,     // When recruiter cancels the invitation
    PENDING, EXPIRED      // When invitation passes expiry time
}