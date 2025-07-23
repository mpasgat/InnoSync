package com.innosync.repository;

import com.innosync.model.ProjectTeamMember;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface ProjectTeamMemberRepository extends JpaRepository<ProjectTeamMember, Long> {

    List<ProjectTeamMember> findByProjectId(Long projectId);

    List<ProjectTeamMember> findByProjectRoleId(Long projectRoleId);

    Optional<ProjectTeamMember> findByProjectRoleIdAndUserId(Long projectRoleId, Long userId);

    boolean existsByProjectRoleIdAndUserId(Long projectRoleId, Long userId);

    List<ProjectTeamMember> findByUserId(Long userId);
}