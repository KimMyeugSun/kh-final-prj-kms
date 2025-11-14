package com.kh.team119.security;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.kh.team119.filter.ErrorResponse;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.web.access.AccessDeniedHandler;

import java.io.IOException;

public class RestAccessDeniedHandler implements AccessDeniedHandler {

    @Override
    public void handle(HttpServletRequest request, HttpServletResponse response, AccessDeniedException accessDeniedException) throws IOException, ServletException {

        response.setCharacterEncoding("UTF-8");
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        response.setStatus(HttpServletResponse.SC_FORBIDDEN); // 403

        new ObjectMapper()
                .writeValue(response.getWriter(),
                        ErrorResponse.builder()
                                .errorMsg("접근 권한 없음")
                                .build());

        response.getWriter().flush();
    }
}