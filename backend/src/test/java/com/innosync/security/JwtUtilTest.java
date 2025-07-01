package com.innosync.security;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;

import java.util.Date;

import static org.assertj.core.api.Assertions.assertThat;
import static org.junit.jupiter.api.Assertions.*;

class JwtUtilTest {

    private JwtUtil jwtUtil;

    @BeforeEach
    void setUp() {
        jwtUtil = new JwtUtil();
    }

    @Test
    void generateToken_WithValidEmail_ShouldReturnValidToken() {
        // Given
        String email = "test@example.com";

        // When
        String token = jwtUtil.generateToken(email);

        // Then
        assertThat(token).isNotNull();
        assertThat(token).isNotEmpty();
        assertThat(token.split("\\.")).hasSize(3); // JWT has 3 parts separated by dots
    }

    @Test
    void extractUsername_WithValidToken_ShouldReturnEmail() {
        // Given
        String email = "test@example.com";
        String token = jwtUtil.generateToken(email);

        // When
        String extractedEmail = jwtUtil.extractUsername(token);

        // Then
        assertThat(extractedEmail).isEqualTo(email);
    }

    @Test
    void validateToken_WithValidToken_ShouldReturnTrue() {
        // Given
        String email = "test@example.com";
        String token = jwtUtil.generateToken(email);

        // When
        boolean isValid = jwtUtil.validateToken(token);

        // Then
        assertThat(isValid).isTrue();
    }

    @Test
    void validateToken_WithInvalidToken_ShouldReturnFalse() {
        // Given
        String invalidToken = "invalid.token.here";

        // When
        boolean isValid = jwtUtil.validateToken(invalidToken);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    void validateToken_WithNullToken_ShouldReturnFalse() {
        // When
        boolean isValid = jwtUtil.validateToken(null);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    void validateToken_WithEmptyToken_ShouldReturnFalse() {
        // When
        boolean isValid = jwtUtil.validateToken("");

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    void extractExpiration_WithValidToken_ShouldReturnFutureDate() {
        // Given
        String email = "test@example.com";
        String token = jwtUtil.generateToken(email);
        Date now = new Date();

        // When
        Date expiration = jwtUtil.extractExpiration(token);

        // Then
        assertThat(expiration).isAfter(now);
        
        // Should be approximately 10 days in the future (allowing for small time differences)
        long expectedExpiration = now.getTime() + (10 * 24 * 60 * 60 * 1000L);
        long actualExpiration = expiration.getTime();
        assertThat(Math.abs(actualExpiration - expectedExpiration)).isLessThan(5000); // Within 5 seconds
    }

    @Test
    void isTokenExpired_WithFreshToken_ShouldReturnFalse() {
        // Given
        String email = "test@example.com";
        String token = jwtUtil.generateToken(email);

        // When
        boolean isExpired = jwtUtil.isTokenExpired(token);

        // Then
        assertThat(isExpired).isFalse();
    }

    @Test
    void generateToken_WithNullEmail_ShouldCreateTokenWithNullSubject() {
        // When
        String token = jwtUtil.generateToken(null);

        // Then
        assertThat(token).isNotNull();
        assertThat(jwtUtil.validateToken(token)).isTrue();
        assertThat(jwtUtil.extractUsername(token)).isNull();
    }

    @Test
    void generateToken_WithEmptyEmail_ShouldCreateTokenWithEmptySubject() {
        // Given
        String emptyEmail = "";

        // When
        String token = jwtUtil.generateToken(emptyEmail);

        // Then
        assertThat(token).isNotNull();
        assertThat(jwtUtil.validateToken(token)).isTrue();
        assertThat(jwtUtil.extractUsername(token)).isEqualTo(emptyEmail);
    }

    @Test
    void generateToken_WithSpecialCharacters_ShouldWork() {
        // Given
        String emailWithSpecialChars = "test+tag@example-domain.com";

        // When
        String token = jwtUtil.generateToken(emailWithSpecialChars);

        // Then
        assertThat(token).isNotNull();
        assertThat(jwtUtil.validateToken(token)).isTrue();
        assertThat(jwtUtil.extractUsername(token)).isEqualTo(emailWithSpecialChars);
    }

    @Test
    void generateToken_MultipleTokensForSameEmail_ShouldBeDifferent() {
        // Given
        String email = "test@example.com";

        // When
        String token1 = jwtUtil.generateToken(email);
        String token2 = jwtUtil.generateToken(email);

        // Then
        assertThat(token1).isNotEqualTo(token2); // Different due to different issue times
        assertThat(jwtUtil.extractUsername(token1)).isEqualTo(email);
        assertThat(jwtUtil.extractUsername(token2)).isEqualTo(email);
        assertThat(jwtUtil.validateToken(token1)).isTrue();
        assertThat(jwtUtil.validateToken(token2)).isTrue();
    }

    @Test
    void validateToken_WithMalformedToken_ShouldReturnFalse() {
        // Given
        String malformedToken = "not.a.valid.jwt.token.structure";

        // When
        boolean isValid = jwtUtil.validateToken(malformedToken);

        // Then
        assertThat(isValid).isFalse();
    }

    @Test
    void validateToken_WithTamperedToken_ShouldReturnFalse() {
        // Given
        String email = "test@example.com";
        String validToken = jwtUtil.generateToken(email);
        String tamperedToken = validToken.substring(0, validToken.length() - 5) + "tamper";

        // When
        boolean isValid = jwtUtil.validateToken(tamperedToken);

        // Then
        assertThat(isValid).isFalse();
    }
} 