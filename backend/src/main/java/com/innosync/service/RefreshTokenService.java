package com.innosync.service;

import com.innosync.dto.AuthResponse;
import com.innosync.model.RefreshToken;
import com.innosync.model.User;
import com.innosync.repository.RefreshTokenRepository;
import com.innosync.repository.UserRepository;
import com.innosync.security.JwtUtil;
import jakarta.validation.Valid;
import lombok.AllArgsConstructor;
import lombok.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.Optional;
import java.util.UUID;

import static java.lang.Long.valueOf;

@Service
public class RefreshTokenService {

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
        RefreshToken refreshToken = new RefreshToken();
        refreshToken.setUser(user);
        refreshToken.setExpiryDate(Instant.now().plusMillis(refreshTokenDurationMs));
        refreshToken.setToken(UUID.randomUUID().toString());
        return refreshTokenRepository.save(refreshToken);
    }

    public Optional<RefreshToken> verifyExpiration(RefreshToken token) {
        if(token.getExpiryDate().isBefore(Instant.now())) {
            deleteByToken(token.getToken());  // make sure to call transactional method here
            return Optional.empty();
        }
        return Optional.of(token);
    }

    @Transactional
    public void deleteToken(User user) {
        refreshTokenRepository.deleteByUser(user);
    }

    @Transactional
    public void deleteByToken(String token) {
        refreshTokenRepository.deleteByToken(token);
    }

    public Optional<AuthResponse> refreshTokenAccess(String refreshToken) {
        return refreshTokenRepository.findByToken(refreshToken)
                .flatMap(this::verifyExpiration)
                .map(RefreshToken::getUser)
                .map(user -> {
                    String newAccessToken = jwtUtil.generateToken(user.getEmail());
                    return new AuthResponse(newAccessToken, refreshToken);
                });
    }
}
