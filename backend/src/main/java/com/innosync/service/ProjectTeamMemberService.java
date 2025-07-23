package com.innosync.service;

import com.innosync.model.ProjectTeamMember;
import com.innosync.model.ProjectRole;
import com.innosync.model.User;
import com.innosync.repository.ProjectTeamMemberRepository;
import com.innosync.repository.ProjectRoleRepository;
import com.innosync.repository.UserRepository;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ProjectTeamMemberService {

    private static final Logger logger = LoggerFactory.getLogger(ProjectTeamMemberService.class);

    private final ProjectTeamMemberRepository teamMemberRepository;
    private final ProjectRoleRepository projectRoleRepository;
    private final UserRepository userRepository;

    @Transactional
    public ProjectTeamMember addTeamMember(Long projectRoleId, Long userId, ProjectTeamMember.JoinMethod joinMethod) {
        logger.info("Adding team member: userId={}, projectRoleId={}, joinMethod={}", userId, projectRoleId, joinMethod);

        ProjectRole projectRole = projectRoleRepository.findById(projectRoleId)
                .orElseThrow(() -> new RuntimeException("Project role not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Check if user is already a team member for this role
        if (teamMemberRepository.existsByProjectRoleIdAndUserId(projectRoleId, userId)) {
            throw new IllegalStateException("User is already a team member for this role");
        }

        ProjectTeamMember teamMember = new ProjectTeamMember();
        teamMember.setProject(projectRole.getProject());
        teamMember.setProjectRole(projectRole);
        teamMember.setUser(user);
        teamMember.setJoinedVia(joinMethod);

        ProjectTeamMember saved = teamMemberRepository.save(teamMember);
        logger.info("Successfully added team member: {}", saved.getId());

        return saved;
    }

    public List<ProjectTeamMember> getTeamMembersByProject(Long projectId) {
        return teamMemberRepository.findByProjectId(projectId);
    }

    public List<ProjectTeamMember> getTeamMembersByProjectRole(Long projectRoleId) {
        return teamMemberRepository.findByProjectRoleId(projectRoleId);
    }

    public List<ProjectTeamMember> getTeamMembersByUser(Long userId) {
        return teamMemberRepository.findByUserId(userId);
    }

        @Transactional
    public void removeTeamMember(Long projectRoleId, Long userId) {
        logger.info("Removing team member: userId={}, projectRoleId={}", userId, projectRoleId);

        ProjectTeamMember teamMember = teamMemberRepository.findByProjectRoleIdAndUserId(projectRoleId, userId)
                .orElseThrow(() -> new RuntimeException("Team member not found"));

        teamMemberRepository.delete(teamMember);
        logger.info("Successfully removed team member");
    }

    @Transactional
    public void removeTeamMemberByProjectAndUser(Long projectId, Long userId) {
        logger.info("Removing team member: userId={}, projectId={}", userId, projectId);

        List<ProjectTeamMember> teamMembers = teamMemberRepository.findByProjectId(projectId);
        ProjectTeamMember teamMember = teamMembers.stream()
                .filter(tm -> tm.getUser().getId().equals(userId))
                .findFirst()
                .orElseThrow(() -> new RuntimeException("Team member not found"));

        teamMemberRepository.delete(teamMember);
        logger.info("Successfully removed team member from project");
    }
}