package com.kh.team119.notification.dto;

import com.kh.team119.notification.entity.NotificationEntity;
import lombok.*;

@Getter
@Builder
@ToString
public class NotificationPacket {
    private Long nno;
    private NotificationType notificationType;
    private String title;
    private String message;

    public static NotificationPacket from(NotificationEntity entity) {
        return NotificationPacket.builder()
                .nno(entity.getNno())
                .notificationType(entity.getNotificationType())
                .title(entity.getTitle())
                .message(entity.getMessage())
                .build();
    }
}
