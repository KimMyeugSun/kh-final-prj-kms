package com.kh.team119.filter;


import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.team119.authentication.SecurityAuthVo;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.roletype.RoleType;
import com.kh.team119.security.SecurityJwtUtil;
import com.kh.team119.security.SecurityUserDetails;
import com.kh.team119.security.refresh.token.RefreshTokenService;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;

import java.io.IOException;
import java.util.List;

@RequiredArgsConstructor
public class AuthenticationFilter extends UsernamePasswordAuthenticationFilter {
    private final AuthenticationManager authenticationManager;
    private final SecurityJwtUtil securityJwtUtil;
    private final RefreshTokenService refreshTokenService;

    // 로그인 요청을 가로채서 인증처리를 시도하는 메서드
    @Override
    public Authentication attemptAuthentication(HttpServletRequest request, HttpServletResponse response) throws AuthenticationException {

        ObjectMapper objectMapper = new ObjectMapper();
        SecurityAuthVo vo = null;
        try {
            vo = objectMapper.readValue(request.getInputStream(), SecurityAuthVo.class);
        } catch (IOException e) {
            throw new RuntimeException(e);
        }

        Authentication authToken = new UsernamePasswordAuthenticationToken(vo.getId(), vo.getPassword());
        return authenticationManager.authenticate(authToken);
    }

    // 인증 성공시 호출되는 메서드
    @Override
    protected void successfulAuthentication(HttpServletRequest request, HttpServletResponse response, FilterChain chain, Authentication authResult) throws IOException, ServletException {

        var userDetails = (SecurityUserDetails) authResult.getPrincipal();
        String id = userDetails.getUsername();
        String name = userDetails.getUserNick();
        List<RoleType> userRole = userDetails.getUserRole();

        StringBuilder roles = new StringBuilder();
        for (RoleType role : userRole) {
            roles.append(role).append(",");
        }
        if (!roles.isEmpty()) {
            roles.deleteCharAt(roles.length() - 1); // 마지막 쉼표 제거
        }

        String accessToken = securityJwtUtil.createAccessToken(id, name, roles.toString());
        String refreshToken = securityJwtUtil.createRefreshToken(id);

        refreshTokenService.deleteRefreshToken(id);
        refreshTokenService.saveRefreshToken(id, refreshToken);

        response.setHeader("Authorization", "Bearer " + accessToken);
        response.setHeader("RefreshToken", refreshToken);
    }

    // 인증 실패시 호출되는 메서드
    @Override
    protected void unsuccessfulAuthentication(HttpServletRequest request, HttpServletResponse response, AuthenticationException failed) throws IOException, ServletException {

        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        new ObjectMapper().writeValue(response.getWriter(), switch (failed.getClass().getSimpleName()) {
            case "BadCredentialsException" -> {
                response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
                yield ErrorResponse.builder()
//                        .errorMsg("비밀번호 불일치")
                        .errorMsg(ErrorCode.MISMATCH_PASSWORD.toString())
                        .build();
            }
            case "UsernameNotFoundException" -> {
                response.setStatus(HttpServletResponse.SC_NOT_FOUND);
                yield ErrorResponse.builder()
//                        .errorMsg("계정을 찾을 수 없음")
                        .errorMsg(ErrorCode.NOT_FOUND_ACCOUNT.toString())
                        .build();
            }
            default -> {
                response.setStatus(HttpServletResponse.SC_CONFLICT);
                yield ErrorResponse.builder()
                        .errorMsg(ErrorCode.UNKNOWN.toString())
                        .build();
            }
        });

        response.getWriter().flush();
    }
}