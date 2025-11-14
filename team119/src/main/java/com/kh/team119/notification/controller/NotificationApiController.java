package com.kh.team119.notification.controller;

import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.notification.dto.Notification;
import com.kh.team119.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/alarm")
public class NotificationApiController {
    private final NotificationService notificationService;

    @PostMapping("/broadcast")
    public ApiResponse<?> broadcast(@RequestBody Notification notification) {
        notificationService.broadcast(notification);

        return ResponseFactory
                .success("브로드캐스트 성공");
    }
}
