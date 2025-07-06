package com.innosync.repository;

import com.innosync.model.Profile;
import com.innosync.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import java.util.Optional;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;

public interface ProfileRepository extends JpaRepository<Profile, Long> {
    // static final Logger logger = LoggerFactory.getLogger(ProfileRepository.class); // Uncomment if you want to log in default methods
    Optional<Profile> findByUser(User user);
}
