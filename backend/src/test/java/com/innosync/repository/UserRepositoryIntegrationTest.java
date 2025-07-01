package com.innosync.repository;

import com.innosync.integration.BaseIntegrationTest;
import com.innosync.model.User;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;

@DataJpaTest
@ActiveProfiles("test")
@Import({com.innosync.config.TestContainersConfig.class})
class UserRepositoryIntegrationTest {

    @Autowired
    private UserRepository userRepository;

    @Test
    void findByEmail_WithExistingUser_ShouldReturnUser() {
        // Given
        User user = new User("john.doe@example.com", "John Doe", "password123");
        userRepository.save(user);

        // When
        Optional<User> result = userRepository.findByEmail("john.doe@example.com");

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("john.doe@example.com");
        assertThat(result.get().getFullName()).isEqualTo("John Doe");
    }

    @Test
    void findByEmail_WithNonExistentUser_ShouldReturnEmpty() {
        // When
        Optional<User> result = userRepository.findByEmail("nonexistent@example.com");

        // Then
        assertThat(result).isEmpty();
    }

    @Test
    void save_WithValidUser_ShouldPersistUser() {
        // Given
        User user = new User("jane.doe@example.com", "Jane Doe", "password456");

        // When
        User savedUser = userRepository.save(user);

        // Then
        assertThat(savedUser.getId()).isNotNull();
        assertThat(savedUser.getEmail()).isEqualTo("jane.doe@example.com");
        assertThat(savedUser.getFullName()).isEqualTo("Jane Doe");

        // Verify persistence
        Optional<User> retrievedUser = userRepository.findById(savedUser.getId());
        assertThat(retrievedUser).isPresent();
        assertThat(retrievedUser.get().getEmail()).isEqualTo("jane.doe@example.com");
    }

    @Test
    void findByEmail_WithCaseInsensitiveEmail_ShouldHandleCorrectly() {
        // Given
        User user = new User("Test.User@Example.COM", "Test User", "password789");
        userRepository.save(user);

        // When
        Optional<User> result = userRepository.findByEmail("Test.User@Example.COM");

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo("Test.User@Example.COM");
    }

    @Test
    void deleteById_WithExistingUser_ShouldRemoveUser() {
        // Given
        User user = new User("to.delete@example.com", "To Delete", "password");
        User savedUser = userRepository.save(user);
        Long userId = savedUser.getId();

        // When
        userRepository.deleteById(userId);

        // Then
        Optional<User> result = userRepository.findById(userId);
        assertThat(result).isEmpty();
    }
} 