package com.kh.team119.notification.dto;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.notification.entity.NotificationEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.ToString;

@Getter
@Builder
@ToString
public class Notification {
    private NotificationType type;
    private String title;
    private String message;

    public NotificationEntity toEntity(EmployeeEntity entity) {
        return NotificationEntity.builder()
                .employeeEntity(entity)
                .notificationType(type)
                .title(title)
                .message(message)
                .build();
    }
}
