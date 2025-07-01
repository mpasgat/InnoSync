package com.innosync.service;

import com.innosync.dto.auth.AuthResponse;
import com.innosync.model.RefreshToken;
import com.innosync.model.User;
import com.innosync.repository.RefreshTokenRepository;
import com.innosync.repository.UserRepository;
import com.innosync.security.JwtUtil;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static org.assertj.core.api.Assertions.assertThat;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class RefreshTokenServiceTest {

    @Mock
    private UserRepository userRepository;

    @Mock
    private RefreshTokenRepository refreshTokenRepository;

    @Mock
    private JwtUtil jwtUtil;

    @InjectMocks
    private RefreshTokenService refreshTokenService;

    private User testUser;
    private RefreshToken testRefreshToken;

    @BeforeEach
    void setUp() {
        testUser = new User("test@example.com", "Test User", "hashedPassword");
        testUser.setId(1L);

        testRefreshToken = new RefreshToken();
        testRefreshToken.setId(UUID.randomUUID());
        testRefreshToken.setToken("test-refresh-token");
        testRefreshToken.setUser(testUser);
        testRefreshToken.setExpiryDate(Instant.now().plusSeconds(604800)); // 7 days
    }

    @Test
    void createRefreshToken_ShouldCreateAndSaveToken() {
        // Given
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(testRefreshToken);

        // When
        RefreshToken result = refreshTokenService.createRefreshToken(testUser);

        // Then
        assertThat(result).isNotNull();
        assertThat(result.getUser()).isEqualTo(testUser);
        assertThat(result.getToken()).isEqualTo("test-refresh-token");
        assertThat(result.getExpiryDate()).isAfter(Instant.now());

        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }

    @Test
    void verifyExpiration_WithValidToken_ShouldReturnToken() {
        // Given
        testRefreshToken.setExpiryDate(Instant.now().plusSeconds(3600)); // 1 hour in future

        // When
        Optional<RefreshToken> result = refreshTokenService.verifyExpiration(testRefreshToken);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get()).isEqualTo(testRefreshToken);
        
        verifyNoInteractions(refreshTokenRepository); // Should not delete valid token
    }

    @Test
    void verifyExpiration_WithExpiredToken_ShouldDeleteAndReturnEmpty() {
        // Given
        testRefreshToken.setExpiryDate(Instant.now().minusSeconds(3600)); // 1 hour ago

        // When
        Optional<RefreshToken> result = refreshTokenService.verifyExpiration(testRefreshToken);

        // Then
        assertThat(result).isEmpty();
        
        verify(refreshTokenRepository).deleteByToken(testRefreshToken.getToken());
    }

    @Test
    void deleteToken_ShouldCallRepositoryDelete() {
        // When
        refreshTokenService.deleteToken(testUser);

        // Then
        verify(refreshTokenRepository).deleteByUser(testUser);
    }

    @Test
    void deleteByToken_ShouldCallRepositoryDeleteByToken() {
        // Given
        String token = "test-token";

        // When
        refreshTokenService.deleteByToken(token);

        // Then
        verify(refreshTokenRepository).deleteByToken(token);
    }

    @Test
    void refreshTokenAccess_WithValidToken_ShouldReturnNewAuthResponse() {
        // Given
        String refreshTokenString = "valid-refresh-token";
        String newAccessToken = "new-access-token";
        
        testRefreshToken.setToken(refreshTokenString);
        testRefreshToken.setExpiryDate(Instant.now().plusSeconds(3600)); // Valid
        
        when(refreshTokenRepository.findByToken(refreshTokenString))
                .thenReturn(Optional.of(testRefreshToken));
        when(jwtUtil.generateToken(testUser.getEmail())).thenReturn(newAccessToken);

        // When
        Optional<AuthResponse> result = refreshTokenService.refreshTokenAccess(refreshTokenString);

        // Then
        assertThat(result).isPresent();
        assertThat(result.get().getAccessToken()).isEqualTo(newAccessToken);
        assertThat(result.get().getRefreshToken()).isEqualTo(refreshTokenString);
        
        verify(refreshTokenRepository).findByToken(refreshTokenString);
        verify(jwtUtil).generateToken(testUser.getEmail());
    }

    @Test
    void refreshTokenAccess_WithInvalidToken_ShouldReturnEmpty() {
        // Given
        String invalidToken = "invalid-token";
        
        when(refreshTokenRepository.findByToken(invalidToken)).thenReturn(Optional.empty());

        // When
        Optional<AuthResponse> result = refreshTokenService.refreshTokenAccess(invalidToken);

        // Then
        assertThat(result).isEmpty();
        
        verify(refreshTokenRepository).findByToken(invalidToken);
        verifyNoInteractions(jwtUtil);
    }

    @Test
    void refreshTokenAccess_WithExpiredToken_ShouldReturnEmpty() {
        // Given
        String expiredTokenString = "expired-refresh-token";
        
        testRefreshToken.setToken(expiredTokenString);
        testRefreshToken.setExpiryDate(Instant.now().minusSeconds(3600)); // Expired
        
        when(refreshTokenRepository.findByToken(expiredTokenString))
                .thenReturn(Optional.of(testRefreshToken));

        // When
        Optional<AuthResponse> result = refreshTokenService.refreshTokenAccess(expiredTokenString);

        // Then
        assertThat(result).isEmpty();
        
        verify(refreshTokenRepository).findByToken(expiredTokenString);
        verify(refreshTokenRepository).deleteByToken(expiredTokenString); // Should delete expired token
        verifyNoInteractions(jwtUtil);
    }

    @Test
    void refreshTokenAccess_WithNullToken_ShouldReturnEmpty() {
        // Given
        when(refreshTokenRepository.findByToken(null)).thenReturn(Optional.empty());

        // When
        Optional<AuthResponse> result = refreshTokenService.refreshTokenAccess(null);

        // Then
        assertThat(result).isEmpty();
        
        verify(refreshTokenRepository).findByToken(null);
    }

    @Test
    void createRefreshToken_WithNullUser_ShouldHandleGracefully() {
        // Given
        RefreshToken tokenWithNullUser = new RefreshToken();
        tokenWithNullUser.setToken("test-token");
        when(refreshTokenRepository.save(any(RefreshToken.class))).thenReturn(tokenWithNullUser);

        // When
        RefreshToken result = refreshTokenService.createRefreshToken(null);

        // Then
        assertThat(result).isNotNull();
        verify(refreshTokenRepository).save(any(RefreshToken.class));
    }
} 