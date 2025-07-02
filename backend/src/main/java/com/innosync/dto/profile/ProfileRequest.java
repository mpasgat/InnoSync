package com.innosync.dto.profile;

import com.fasterxml.jackson.annotation.JsonProperty;
import com.innosync.model.Education;
import com.innosync.model.ExpertiseLevel;
import com.innosync.model.ExperienceYears;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.util.List;


@Data
@AllArgsConstructor
@NoArgsConstructor
public class ProfileRequest {
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
    @JsonProperty("work_experience")
    private List<WorkExperienceRequest> workExperience;
    @JsonProperty("technologies")
    private List<String> technologies;
}
