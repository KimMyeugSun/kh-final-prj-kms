package com.kh.team119.notification.repository;

import com.kh.team119.notification.entity.NotificationEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface NotificationRepository extends JpaRepository<NotificationEntity, Long>, NotificationRepositoryDSL {

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
    INSERT INTO notification (eno, is_read, message, notification_type, title)
    SELECT
        e.eno,
        false,
        :message,
        :type,
        :title
    FROM employee e
    WHERE e.eno <> 0 AND e.eno < 1000
    """, nativeQuery = true)
    int bulkInsertMonthlyNotification(@Param("message") String message,
                                      @Param("type") String type,
                                      @Param("title") String title);
}
