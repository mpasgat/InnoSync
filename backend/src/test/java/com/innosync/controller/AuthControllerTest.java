package com.innosync.controller;

import com.innosync.dto.auth.*;
import com.innosync.model.RefreshToken;
import com.innosync.model.User;
import com.innosync.repository.UserRepository;
import com.innosync.security.JwtUtil;
import com.innosync.service.RefreshTokenService;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;

import java.util.Optional;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.ArgumentMatchers.anyString;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class AuthControllerTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private JwtUtil jwtUtil;

    @Mock
    private RefreshTokenService refreshTokenService;

    @InjectMocks
    private AuthController authController;

    private BCryptPasswordEncoder passwordEncoder;
    private User testUser;
    private RefreshToken testRefreshToken;

    @BeforeEach
    void setUp() {
        passwordEncoder = new BCryptPasswordEncoder();
        
        testUser = new User("test@example.com", "Test User", passwordEncoder.encode("password"));
        testUser.setId(1L);

        testRefreshToken = new RefreshToken();
        testRefreshToken.setToken("refresh-token-123");
        testRefreshToken.setUser(testUser);
    }

    @Test
    void signUp_WithValidData_ShouldCreateUserAndReturnTokens() {
        // Given
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setEmail("new@example.com");
        signUpRequest.setFullName("New User");
        signUpRequest.setPassword("password123");

        when(userRepository.findByEmail("new@example.com")).thenReturn(Optional.empty());
        when(userRepository.save(any(User.class))).thenReturn(testUser);
        when(jwtUtil.generateToken("new@example.com")).thenReturn("access-token");
        when(refreshTokenService.createRefreshToken(any(User.class))).thenReturn(testRefreshToken);

        // When
        ResponseEntity<?> response = authController.signUp(signUpRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isInstanceOf(AuthResponse.class);
        
        AuthResponse authResponse = (AuthResponse) response.getBody();
        assertThat(authResponse.getAccessToken()).isEqualTo("access-token");
        assertThat(authResponse.getRefreshToken()).isEqualTo("refresh-token-123");

        verify(userRepository).findByEmail("new@example.com");
        verify(userRepository).save(any(User.class));
        verify(jwtUtil).generateToken("new@example.com");
        verify(refreshTokenService).createRefreshToken(any(User.class));
    }

    @Test
    void signUp_WithExistingEmail_ShouldReturnConflict() {
        // Given
        SignUpRequest signUpRequest = new SignUpRequest();
        signUpRequest.setEmail("existing@example.com");
        signUpRequest.setFullName("Existing User");
        signUpRequest.setPassword("password123");

        when(userRepository.findByEmail("existing@example.com")).thenReturn(Optional.of(testUser));

        // When
        ResponseEntity<?> response = authController.signUp(signUpRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.CONFLICT);
        assertThat(response.getBody()).isEqualTo("Email is already registered!");

        verify(userRepository).findByEmail("existing@example.com");
        verify(userRepository, never()).save(any());
        verifyNoInteractions(jwtUtil, refreshTokenService);
    }

    @Test
    void signIn_WithValidCredentials_ShouldReturnTokens() {
        // Given
        SignInRequest signInRequest = new SignInRequest();
        signInRequest.setEmail("test@example.com");
        signInRequest.setPassword("password");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));
        when(jwtUtil.generateToken("test@example.com")).thenReturn("access-token");
        when(refreshTokenService.createRefreshToken(testUser)).thenReturn(testRefreshToken);

        // When
        ResponseEntity<?> response = authController.singIn(signInRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isInstanceOf(AuthResponse.class);
        
        AuthResponse authResponse = (AuthResponse) response.getBody();
        assertThat(authResponse.getAccessToken()).isEqualTo("access-token");
        assertThat(authResponse.getRefreshToken()).isEqualTo("refresh-token-123");

        verify(userRepository).findByEmail("test@example.com");
        verify(jwtUtil).generateToken("test@example.com");
        verify(refreshTokenService).createRefreshToken(testUser);
    }

    @Test
    void signIn_WithInvalidEmail_ShouldReturnUnauthorized() {
        // Given
        SignInRequest signInRequest = new SignInRequest();
        signInRequest.setEmail("invalid@example.com");
        signInRequest.setPassword("password");

        when(userRepository.findByEmail("invalid@example.com")).thenReturn(Optional.empty());

        // When
        ResponseEntity<?> response = authController.singIn(signInRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isEqualTo("Invalid credentials");

        verify(userRepository).findByEmail("invalid@example.com");
        verifyNoInteractions(jwtUtil, refreshTokenService);
    }

    @Test
    void signIn_WithWrongPassword_ShouldReturnUnauthorized() {
        // Given
        SignInRequest signInRequest = new SignInRequest();
        signInRequest.setEmail("test@example.com");
        signInRequest.setPassword("wrongpassword");

        when(userRepository.findByEmail("test@example.com")).thenReturn(Optional.of(testUser));

        // When
        ResponseEntity<?> response = authController.singIn(signInRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isEqualTo("Invalid credentials");

        verify(userRepository).findByEmail("test@example.com");
        verifyNoInteractions(jwtUtil, refreshTokenService);
    }

    @Test
    void refreshToken_WithValidToken_ShouldReturnNewTokens() {
        // Given
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken("valid-refresh-token");

        AuthResponse newAuthResponse = new AuthResponse("new-access-token", "valid-refresh-token");
        when(refreshTokenService.refreshTokenAccess("valid-refresh-token"))
                .thenReturn(Optional.of(newAuthResponse));

        // When
        ResponseEntity<?> response = authController.refreshToken(request);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isInstanceOf(AuthResponse.class);
        
        AuthResponse authResponse = (AuthResponse) response.getBody();
        assertThat(authResponse.getAccessToken()).isEqualTo("new-access-token");

        verify(refreshTokenService).refreshTokenAccess("valid-refresh-token");
    }

    @Test
    void refreshToken_WithInvalidToken_ShouldReturnUnauthorized() {
        // Given
        RefreshTokenRequest request = new RefreshTokenRequest();
        request.setRefreshToken("invalid-refresh-token");

        when(refreshTokenService.refreshTokenAccess("invalid-refresh-token"))
                .thenReturn(Optional.empty());

        // When
        ResponseEntity<?> response = authController.refreshToken(request);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.UNAUTHORIZED);
        assertThat(response.getBody()).isInstanceOf(AuthResponse.class);
        
        AuthResponse authResponse = (AuthResponse) response.getBody();
        assertThat(authResponse.getAccessToken()).isNull();
        assertThat(authResponse.getRefreshToken()).isEqualTo("Invalid or expired refresh token");

        verify(refreshTokenService).refreshTokenAccess("invalid-refresh-token");
    }

    @Test
    void logout_WithValidToken_ShouldReturnSuccess() {
        // Given
        LogoutRequest logoutRequest = new LogoutRequest();
        logoutRequest.setRefreshToken("valid-refresh-token");

        doNothing().when(refreshTokenService).deleteByToken("valid-refresh-token");

        // When
        ResponseEntity<?> response = authController.logout(logoutRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.OK);
        assertThat(response.getBody()).isEqualTo("Logged out successfully");

        verify(refreshTokenService).deleteByToken("valid-refresh-token");
    }

    @Test
    void logout_WithException_ShouldReturnInternalServerError() {
        // Given
        LogoutRequest logoutRequest = new LogoutRequest();
        logoutRequest.setRefreshToken("problematic-token");

        doThrow(new RuntimeException("Database error"))
                .when(refreshTokenService).deleteByToken("problematic-token");

        // When
        ResponseEntity<?> response = authController.logout(logoutRequest);

        // Then
        assertThat(response.getStatusCode()).isEqualTo(HttpStatus.INTERNAL_SERVER_ERROR);
        assertThat(response.getBody()).isEqualTo("Logout failed");

        verify(refreshTokenService).deleteByToken("problematic-token");
    }
} 