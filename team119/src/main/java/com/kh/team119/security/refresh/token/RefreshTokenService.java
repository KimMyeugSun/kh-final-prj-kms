package com.kh.team119.security.refresh.token;

import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class RefreshTokenService {
    private final RefreshTokenRepository refreshTokenRepository;

    public void saveRefreshToken(String userId, String refreshToken) {
        var entity = RefreshTokenEntity.builder()
                .userId(userId)
                .token(refreshToken)
                .expiry(LocalDateTime.now().plusDays(7))
                .build();

        refreshTokenRepository.save(entity);
    }

    public boolean isValid(String refreshToken){
        return refreshTokenRepository.findByToken(refreshToken)
                .filter(rt -> rt.getExpiry().isAfter(LocalDateTime.now()))
                .isPresent();
    }

    public void deleteRefreshToken(String userId) {
        refreshTokenRepository.deleteByUserId(userId);
    }
}
