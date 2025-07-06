package com.innosync.repository;

import com.innosync.model.ProjectRole;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectRoleRepository extends JpaRepository<ProjectRole, Long> {
    static final Logger logger = LoggerFactory.getLogger(ProjectRoleRepository.class);

    List<ProjectRole> findByProjectId(Long  projectId);
    Optional<ProjectRole> findById(Long id);
    @Query("SELECT pr FROM ProjectRole pr JOIN FETCH pr.project")
    List<ProjectRole> findAllWithProjectInfo();
}
