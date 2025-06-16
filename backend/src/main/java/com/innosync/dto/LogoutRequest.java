package com.innosync.dto;

import lombok.Data;

@Data
public class LogoutRequest {
    private String refreshToken;
}
