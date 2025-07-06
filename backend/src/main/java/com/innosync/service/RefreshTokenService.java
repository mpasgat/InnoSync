package com.innosync.service;

import com.innosync.dto.auth.AuthResponse;
import com.innosync.model.RefreshToken;
import com.innosync.model.User;
import com.innosync.repository.RefreshTokenRepository;
import com.innosync.repository.UserRepository;
import com.innosync.security.JwtUtil;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static java.lang.Long.valueOf;

@Service
public class RefreshTokenService {

    private static final Logger logger = LoggerFactory.getLogger(RefreshTokenService.class);

    private final JwtUtil jwtUtil;
    private Long refreshTokenDurationMs = valueOf(604800000);
    private UserRepository userRepository;
    private RefreshTokenRepository refreshTokenRepository;

    public RefreshTokenService(UserRepository userRepository, RefreshTokenRepository refreshTokenRepository, JwtUtil jwtUtil) {
        this.userRepository = userRepository;
        this.refreshTokenRepository = refreshTokenRepository;
        this.jwtUtil = jwtUtil;
    }

    public RefreshToken createRefreshToken(User user) {
        if (user == null) {
            logger.warn("Attempted to create refresh token for null user");
            throw new IllegalArgumentException("User cannot be null");
        }
        logger.info("Creating refresh token for user: {}", user.getEmail());
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());
        RefreshToken saved = refreshTokenRepository.save(refreshToken);
        logger.debug("Refresh token created: {}", saved.getToken());
        return saved;
    }

    public Optional<RefreshToken> verifyExpiration(RefreshToken token) {
        logger.debug("Verifying expiration for refresh token: {}", token.getToken());
        if(token.getExpiryDate().isBefore(Instant.now())) {
            logger.warn("Refresh token expired: {}", token.getToken());
            deleteByToken(token.getToken());  // make sure to call transactional method here
            return Optional.empty();
        }
        logger.debug("Refresh token valid: {}", token.getToken());
        return Optional.of(token);
    }

    @Transactional
    public void deleteToken(User user) {
        logger.info("Deleting all refresh tokens for user: {}", user.getEmail());
        refreshTokenRepository.deleteByUser(user);
    }

    @Transactional
    public void deleteByToken(String token) {
        logger.info("Deleting refresh token: {}", token);
        refreshTokenRepository.deleteByToken(token);
    }

    public Optional<AuthResponse> refreshTokenAccess(String refreshToken) {
        logger.info("Refreshing access token using refresh token: {}", refreshToken);
        return refreshTokenRepository.findByToken(refreshToken)
                .flatMap(this::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String newAccessToken = jwtUtil.generateToken(user.getEmail());
                    logger.info("New access token generated for user: {}", user.getEmail());
                    return new AuthResponse(newAccessToken, refreshToken);
                });
    }
}
