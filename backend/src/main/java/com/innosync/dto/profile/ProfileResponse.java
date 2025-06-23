package com.innosync.dto.profile;

import com.innosync.model.Education;
import com.innosync.model.ExpertiseLevel;
import lombok.Data;

@Data
public class ProfileResponse {
    private String email;
    private String fullName;
    private String telegram;
    private String github;
    private String bio;
    private String position;
    private Education education;
    private String expertise;
    private ExpertiseLevel expertiseLevel;
    private String resume;
}
