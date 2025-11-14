package com.kh.team119.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.team119.filter.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;

import java.io.IOException;

public class RestAuthenticationEntryPoint implements AuthenticationEntryPoint {

    @Override
    public void commence(HttpServletRequest request, HttpServletResponse response, AuthenticationException authException) throws IOException, ServletException {

        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        response.setStatus(HttpServletResponse.SC_UNAUTHORIZED); // 401

        new ObjectMapper()
                .writeValue(response.getWriter(),
                        ErrorResponse.builder()
                                .errorMsg("인증되지 않은 사용자")
                                .build());

        response.getWriter().flush();
    }
}