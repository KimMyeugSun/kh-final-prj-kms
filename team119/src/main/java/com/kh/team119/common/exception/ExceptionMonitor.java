package com.kh.team119.common.exception;

import jakarta.persistence.PersistenceException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice(basePackages = {"com.kh.team119"})
public class ExceptionMonitor {

    @ExceptionHandler(Team119Exception.class)
    public ResponseEntity<Map<String, Object>> team119Exception(final Team119Exception e) {

        e.printStackTrace();

        Map<String, Object> map = new HashMap<>();
        map.put("timestamp", LocalDateTime.now());
        map.put("errorMsg", e.getMessage());

        return ResponseEntity
                .badRequest()
                .body(map);
    }

    @ExceptionHandler(PersistenceException.class)
    public ResponseEntity<String> handlePersistenceException(PersistenceException e) {
        return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                .body("DB 제약 조건 위반: " + e.getMessage());
    }
}