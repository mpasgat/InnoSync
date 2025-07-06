package com.innosync.repository;

import com.innosync.model.User;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
    // static final Logger logger = LoggerFactory.getLogger(UserRepository.class); // Uncomment if you want to log in default methods
    Optional<User> findByEmail(String email);
    Optional<User> findById(Long id);

    default void logFindByEmail(String email) {
        Logger logger = LoggerFactory.getLogger(UserRepository.class);
        logger.info("findByEmail called with: {}", email);
    }
}
