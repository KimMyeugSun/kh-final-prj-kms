package com.kh.team119.filter;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.team119.authentication.SecurityAuthVo;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.roletype.RoleType;
import com.kh.team119.security.SecurityJwtUtil;
import com.kh.team119.security.SecurityUserDetails;
import io.jsonwebtoken.ExpiredJwtException;
import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpMethod;
import org.springframework.http.MediaType;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.util.AntPathMatcher;
import org.springframework.util.StringUtils;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;
import java.util.Arrays;
import java.util.Set;

@RequiredArgsConstructor
public class JwtFilter extends OncePerRequestFilter {
    private final SecurityJwtUtil securityJwtUtil;
    private final AntPathMatcher matcher = new AntPathMatcher();

    private static final Set<String> WHITELIST = Set.of(
            "/swagger-ui/**",
            "/v3/api-docs/**",
            "/swagger-ui.html",
            "/management/sign-in",
            "/",
            "/sign-in",
            "/sign-up",
            "/dashboard",
            "/notification",
            "/welfare-point",
            "/actuator/health"
    );

    @Override
    protected boolean shouldNotFilter(HttpServletRequest request) throws ServletException {
        String path = request.getRequestURI();
        if (HttpMethod.OPTIONS.matches(request.getMethod())) return true;

        return WHITELIST.stream().anyMatch(pattern -> matcher.match(pattern, path));
    }

    @Override
    protected void doFilterInternal(HttpServletRequest request, HttpServletResponse response, FilterChain filterChain) throws ServletException, IOException {
//        String path = request.getRequestURI();
//        if (path.startsWith("/notification")) {
//            filterChain.doFilter(request, response); // 인증 검사 없이 통과
//            return;
//        }

        var authorization = request.getHeader("Authorization");

        //!< Bearer 토큰이 아니면 필터체인 계속 진행
        if (!StringUtils.hasText(authorization) || !authorization.startsWith("Bearer ")) {
            filterChain.doFilter(request, response);
            return;
        }

        var accessToken = authorization.substring("Bearer ".length());

        try {
            //!< 토큰 만료 되면 예외 발생(ExpiredJwtException) -> catch문으로 이동
            securityJwtUtil.isExpired(accessToken);
        } catch (ExpiredJwtException e) {
            response.setCharacterEncoding("UTF-8");
            response.setContentType(MediaType.APPLICATION_JSON_VALUE);
            response.setStatus(HttpServletResponse.SC_UNAUTHORIZED);
            new ObjectMapper()
                    .writeValue(response.getWriter(),
                            ErrorResponse.builder()
                                    .errorMsg(ErrorCode.EXPIRED_TOKEN.getMessage())
                                    .build());

            return;
        }

        SecurityAuthVo vo = new SecurityAuthVo();
        vo.setId(securityJwtUtil.getUserId(accessToken));
        vo.setName(securityJwtUtil.getUserNick(accessToken));
        var rolesArr = securityJwtUtil.getUserRole(accessToken);
        var roles = Arrays.stream(rolesArr.split(","))
                .map(RoleType::valueOf)
                .toList();

        vo.setRoles(roles);

        SecurityUserDetails principal = new SecurityUserDetails(vo);

        var authToken = new UsernamePasswordAuthenticationToken(principal, null, principal.getAuthorities());
        SecurityContextHolder.getContext().setAuthentication(authToken);

        filterChain.doFilter(request, response);
    }
}
