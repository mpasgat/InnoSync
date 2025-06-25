package com.innosync.repository;

import com.innosync.model.Project;
import com.innosync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByRecruiter(User recruiter);
}
