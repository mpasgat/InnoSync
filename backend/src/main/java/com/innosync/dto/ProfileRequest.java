package com.innosync.dto;

import com.innosync.model.Education;
import com.innosync.model.ExpertiseLevel;
import lombok.Data;

@Data
public class ProfileRequest {
    private String telegram;
    private String github;
    private String bio;
    private String position;
    private Education education;
    private String expertise;
    private ExpertiseLevel expertiseLevel;
    private String resume;
}
