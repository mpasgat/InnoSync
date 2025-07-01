package com.innosync.service;

import com.innosync.model.User;
import com.innosync.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.LocalDateTime;
import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.Mockito.verify;
import static org.mockito.Mockito.when;

@ExtendWith(MockitoExtension.class)
class UserServiceTest {

    @Mock
    private UserRepository userRepository;

    @InjectMocks
    private UserService userService;

    private User testUser;

    @BeforeEach
    void setUp() {
        testUser = new User("test@example.com", "Test User", "hashedPassword123");
        testUser.setId(1L);
        testUser.setCreatedAt(LocalDateTime.now());
    }

    @Test
    void getUser_WhenUserExists_ShouldReturnUser() {
        // Given
        String email = "test@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.of(testUser));

        // When
        Optional<User> result = userService.getUser(email);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getEmail()).isEqualTo(email);
        assertThat(result.get().getFullName()).isEqualTo("Test User");
        assertThat(result.get().getId()).isEqualTo(1L);
        
        verify(userRepository).findByEmail(email);
    }

    @Test
    void getUser_WhenUserDoesNotExist_ShouldReturnEmpty() {
        // Given
        String email = "nonexistent@example.com";
        when(userRepository.findByEmail(email)).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.getUser(email);

        // Then
        assertThat(result).isEmpty();
        
        verify(userRepository).findByEmail(email);
    }

    @Test
    void getUser_WithNullEmail_ShouldCallRepository() {
        // Given
        when(userRepository.findByEmail(null)).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.getUser(null);

        // Then
        assertThat(result).isEmpty();
        
        verify(userRepository).findByEmail(null);
    }

    @Test
    void getUser_WithEmptyEmail_ShouldCallRepository() {
        // Given
        String emptyEmail = "";
        when(userRepository.findByEmail(emptyEmail)).thenReturn(Optional.empty());

        // When
        Optional<User> result = userService.getUser(emptyEmail);

        // Then
        assertThat(result).isEmpty();
        
        verify(userRepository).findByEmail(emptyEmail);
    }
}