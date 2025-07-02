package com.innosync.dto.profile;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.innosync.model.Education;
import com.innosync.model.ExpertiseLevel;
import com.innosync.model.ExperienceYears;
import lombok.Data;

import java.util.List;

@Data
public class ProfileResponse {
    private Long id;
    private String email;
    private String fullName;
    private String telegram;
    private String github;
    private String bio;
    private String position;
    private Education education;
    private String expertise;
    @JsonProperty("expertise_level")
    private ExpertiseLevel expertiseLevel;
    @JsonProperty("experience_years")
    private ExperienceYears experienceYears;
    private String resume;
    private String profilePicture;
    @JsonProperty("work_experience")
    private List<WorkExperienceResponse> workExperience;
    private List<String> technologies;
}
