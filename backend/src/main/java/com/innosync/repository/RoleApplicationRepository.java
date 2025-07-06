package com.innosync.repository;

import com.innosync.model.RoleApplication;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoleApplicationRepository extends JpaRepository<RoleApplication, Long> {
    static final Logger logger = LoggerFactory.getLogger(RoleApplicationRepository.class);

    List<RoleApplication> findByProjectRoleId(Long projectRoleId);
    List<RoleApplication> findByUserId(Long userId);
    Optional<RoleApplication> findByUserIdAndProjectRoleId(Long userId, Long projectRoleId);
    boolean existsByUserIdAndProjectRoleId(Long userId, Long projectRoleId);
}
