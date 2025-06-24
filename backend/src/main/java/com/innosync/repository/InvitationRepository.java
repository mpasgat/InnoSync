package com.innosync.repository;

import com.innosync.model.Invitation;
import com.innosync.model.InvitationStatus;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface InvitationRepository extends JpaRepository<Invitation, Long> {
    List<Invitation> findByProjectRoleId(Long projectRoleId);
    List<Invitation> findByRecipientId(Long recipientId);
    Optional<Invitation> findByRecipientIdAndProjectRoleId(Long recipientId, Long projectRoleId);
    boolean existsByRecipientIdAndProjectRoleIdAndStatus(Long recipientId, Long projectRoleId, InvitationStatus status);
    List<Invitation> findBySenderId(Long senderId);
}
