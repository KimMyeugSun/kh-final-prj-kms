package com.kh.team119.security;

import io.jsonwebtoken.Jwts;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import javax.crypto.SecretKey;
import javax.crypto.spec.SecretKeySpec;
import java.nio.charset.StandardCharsets;
import java.util.Date;

@Component
public class SecurityJwtUtil {
    private final SecretKey secretKey;
    int expirationAccessTokenTime = 1000 * 60 * 15; //!< 15분
    int expirationRefreshTokenTime = 1000 * 60 * 60 * 24 * 7; //!< 7일

//    int expirationTime = 1000 * 60 * 60 * 24; //!< 24시간 (테스트용)

    public SecurityJwtUtil(@Value("${team119.jwt.secret.key}") String str) {
        byte[] bytes = str.getBytes(StandardCharsets.UTF_8);
        String algorithm = Jwts.SIG.HS256.key().build().getAlgorithm();

        this.secretKey = new SecretKeySpec(bytes, algorithm);
    }

    public String getUserId(String token) {
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token)
                .getPayload()
                .getSubject();
    }

    public String getUserNick(String token) {
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token)
                .getPayload()
                .get("name", String.class);
    }

    public String getUserRole(String token) {
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token)
                .getPayload()
                .get("Roles", String.class);
    }

    public boolean isExpired(String token) {
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(token)
                .getPayload()
                .getExpiration().before(new Date());
    }

    /**
     * * Accress Token 생성
     * * @param params 가변인자 (userId, userName, role)
     * * @return JWT 문자열
     */
    public String createAccessToken(String id, String name, String roles) {

        return Jwts.builder()
                .subject(id)
                .claim("name", name)
                .claim("Roles", roles)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationAccessTokenTime))
                .signWith(secretKey)
                .compact();

    }

    /**
     * Refresh Token 생성
     * @param userId 사용자 ID
     * @return JWT 문자열
     */
    public String createRefreshToken(String userId) {

        return Jwts.builder()
                .subject(userId)
                .issuedAt(new Date(System.currentTimeMillis()))
                .expiration(new Date(System.currentTimeMillis() + expirationRefreshTokenTime)) // 7일
                .signWith(secretKey)
                .compact();

    }

    /**
     * Refresh Token에서 사용자 ID 추출
     * @param refreshToken 리프레시 토큰
     * @return 사용자 ID
     */
    public String findIdByRefreshToken(String refreshToken) {
        return Jwts.parser().verifyWith(secretKey).build()
                .parseSignedClaims(refreshToken)
                .getPayload()
                .getSubject();
    }
}
