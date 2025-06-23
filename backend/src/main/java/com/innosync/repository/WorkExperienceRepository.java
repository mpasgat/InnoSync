package com.innosync.repository;

import com.innosync.model.Profile;
import com.innosync.model.WorkExperience;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Long> {
    List<WorkExperience> findByProfile(Profile profile);
    void deleteByProfile(Profile profile);
}
