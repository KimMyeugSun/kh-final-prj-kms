package com.kh.team119.notification.controller;

import com.kh.team119.notification.dto.ReqNotificationDone;
import com.kh.team119.notification.dto.ReqNotificationUnProcessed;
import com.kh.team119.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.context.event.EventListener;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.socket.messaging.SessionConnectEvent;
import org.springframework.web.socket.messaging.SessionDisconnectEvent;

import java.util.Map;

@Controller
@RequiredArgsConstructor
public class NotificationController {
    private final NotificationService notificationService;

    @EventListener
    public void connect(SessionConnectEvent event) {
        String sessionId = String.valueOf(event.getMessage().getHeaders().get("simpSessionId"));
        Object nativeHeaders = event.getMessage().getHeaders().get("nativeHeaders");
        long eno = 0L;
        if (nativeHeaders instanceof Map) {
            Object enoObj = ((Map<?, ?>) nativeHeaders).get("eno");
            if (enoObj instanceof java.util.List && !((java.util.List<?>) enoObj).isEmpty()) {
                Object enoVal = ((java.util.List<?>) enoObj).get(0);
                eno = enoVal != null ? Long.parseLong(enoVal.toString()) : 0L;
            }
        }

        notificationService.connect(sessionId, eno);
    }

    @EventListener
    public void disconnect(SessionDisconnectEvent event) {
        String sessionId = event.getSessionId();
        notificationService.disconnect(sessionId);
    }

    //!< 로그인 했을 때 처리 안된 알림들 보내기
    @MessageMapping("/unprocessed")
    public void receive(ReqNotificationUnProcessed req) {
        notificationService.getUnprocessedNotification(req.getEno());
    }

    //!< 알림 처리 완료
    @MessageMapping("/done")
    public void done(ReqNotificationDone dto) {
        notificationService.done(dto);
    }
}