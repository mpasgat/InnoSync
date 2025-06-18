package com.innosync.dto;

import lombok.Data;

@Data
public class ProfileRequest {
    private String desiredPosition;
    private String techStack;
    private String level;
    private String githubLink;
    private String linkedinLink;
    private String bio;
}
