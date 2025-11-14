package com.kh.team119.notification.repository;

import com.kh.team119.notification.dto.Notification;
import com.kh.team119.notification.entity.NotificationEntity;

import java.util.List;

public interface NotificationRepositoryDSL {
    List<NotificationEntity> findByEno(Long eno);

    boolean existsNotificationAndIsReadFalse(Long nno, Long eno);

    void done(Long nno, Long eno);

    List<NotificationEntity> insertAlarmByAllEmployee(Notification dto);
}
