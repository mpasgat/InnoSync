package com.innosync.repository;

import com.innosync.model.Profile;
import com.innosync.model.WorkExperience;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface WorkExperienceRepository extends JpaRepository<WorkExperience, Long> {
    static final Logger logger = LoggerFactory.getLogger(WorkExperienceRepository.class);

    List<WorkExperience> findByProfile(Profile profile);

    @Modifying
    @Transactional
    void deleteByProfile(Profile profile);
}
