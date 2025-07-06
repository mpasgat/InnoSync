package com.innosync.repository;

import com.innosync.model.Project;
import com.innosync.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    static final Logger logger = LoggerFactory.getLogger(ProjectRepository.class);

    List<Project> findByRecruiter(User recruiter);
}
