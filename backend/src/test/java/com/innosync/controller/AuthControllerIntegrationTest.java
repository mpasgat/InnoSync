package com.innosync.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.innosync.dto.auth.SignInRequest;
import com.innosync.dto.auth.SignUpRequest;
import com.innosync.model.User;
import com.innosync.repository.UserRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.http.MediaType;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.test.context.ActiveProfiles;
import org.springframework.test.web.servlet.MockMvc;
import org.springframework.test.web.servlet.setup.MockMvcBuilders;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.context.WebApplicationContext;

import static org.hamcrest.Matchers.notNullValue;
import static org.springframework.security.test.web.servlet.setup.SecurityMockMvcConfigurers.springSecurity;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.*;

@SpringBootTest(webEnvironment = SpringBootTest.WebEnvironment.RANDOM_PORT)
@ActiveProfiles("test")
@Import(com.innosync.config.TestContainersConfig.class)
@Transactional
class AuthControllerIntegrationTest {

    @Autowired
    private WebApplicationContext context;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private ObjectMapper objectMapper;

    private MockMvc mockMvc;

    @BeforeEach
    void setUp() {
        mockMvc = MockMvcBuilders
                .webAppContextSetup(context)
                .apply(springSecurity())
                .build();
        
        // Clean database before each test
        userRepository.deleteAll();
    }

    @Test
    void signUp_WithValidData_ShouldCreateUserAndReturnToken() throws Exception {
        // Given
        SignUpRequest signUpRequest = new SignUpRequest(
                "test@example.com",
                "Test User",
                "Password123!"
        );

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()));

        // Verify user was created in database
        assert userRepository.findByEmail("test@example.com").isPresent();
    }

    @Test
    void signUp_WithExistingEmail_ShouldReturnConflict() throws Exception {
        // Given
        User existingUser = new User("test@example.com", "Existing User", passwordEncoder.encode("password"));
        userRepository.save(existingUser);

        SignUpRequest signUpRequest = new SignUpRequest(
                "test@example.com",
                "New User",
                "Password123!"
        );

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isConflict());
    }

    @Test
    void signUp_WithInvalidEmail_ShouldReturnBadRequest() throws Exception {
        // Given
        SignUpRequest signUpRequest = new SignUpRequest(
                "invalid-email",
                "Test User",
                "Password123!"
        );

        // When & Then
        mockMvc.perform(post("/api/auth/signup")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signUpRequest)))
                .andExpect(status().isBadRequest());
    }

    @Test
    void signIn_WithValidCredentials_ShouldReturnToken() throws Exception {
        // Given
        User user = new User("test@example.com", "Test User", passwordEncoder.encode("Password123!"));
        userRepository.save(user);

        SignInRequest signInRequest = new SignInRequest(
                "test@example.com",
                "Password123!"
        );

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signInRequest)))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.accessToken", notNullValue()))
                .andExpect(jsonPath("$.refreshToken", notNullValue()));
    }

    @Test
    void signIn_WithInvalidPassword_ShouldReturnUnauthorized() throws Exception {
        // Given
        User user = new User("test@example.com", "Test User", passwordEncoder.encode("CorrectPassword"));
        userRepository.save(user);

        SignInRequest signInRequest = new SignInRequest(
                "test@example.com",
                "WrongPassword"
        );

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signInRequest)))
                .andExpect(status().isUnauthorized());
    }

    @Test
    void signIn_WithNonExistentUser_ShouldReturnUnauthorized() throws Exception {
        // Given
        SignInRequest signInRequest = new SignInRequest(
                "nonexistent@example.com",
                "Password123!"
        );

        // When & Then
        mockMvc.perform(post("/api/auth/login")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content(objectMapper.writeValueAsString(signInRequest)))
                .andExpect(status().isUnauthorized());
    }
} 