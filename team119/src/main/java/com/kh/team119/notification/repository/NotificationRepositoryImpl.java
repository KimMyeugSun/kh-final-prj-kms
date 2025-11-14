package com.kh.team119.notification.repository;

import com.kh.team119.notification.dto.Notification;
import com.kh.team119.notification.dto.NotificationType;
import com.kh.team119.notification.entity.NotificationEntity;
import com.kh.team119.notification.entity.QNotificationEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import jakarta.persistence.EntityManager;
import jakarta.persistence.Query;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.kh.team119.notification.entity.QNotificationEntity.notificationEntity;

@RequiredArgsConstructor
public class NotificationRepositoryImpl implements NotificationRepositoryDSL {
    private final JPAQueryFactory jpaQueryFactory;
    private final EntityManager em;

    @Override
    public List<NotificationEntity> findByEno(Long eno) {
        return jpaQueryFactory
                .selectFrom(notificationEntity)
                .where(
                        notificationEntity.employeeEntity.eno.eq(eno)
                        , notificationEntity.isRead.eq(false)
                )
                .fetch();
    }

    @Override
    public boolean existsNotificationAndIsReadFalse(Long nno, Long eno) {
        Integer fetchOne = jpaQueryFactory
                .selectOne()
                .from(notificationEntity)
                .where(
                        notificationEntity.nno.eq(nno)
                        , notificationEntity.employeeEntity.eno.eq(eno)
                        , notificationEntity.isRead.eq(false)
                )
                .fetchFirst();
        return fetchOne != null;
    }

    @Override
    public void done(Long nno, Long eno) {
        jpaQueryFactory
                .update(notificationEntity)
                .set(notificationEntity.isRead, true)
                .where(
                        notificationEntity.nno.eq(nno)
                        , notificationEntity.employeeEntity.eno.eq(eno)
                        , notificationEntity.isRead.eq(false)
                )
                .execute();
    }

    @Override
    public List<NotificationEntity> insertAlarmByAllEmployee(Notification dto) {
        String cteSql = """
                WITH ins AS(
                INSERT INTO notification (title, message, notification_type, eno, is_read)
                SELECT
                    :title
                    , :message
                    , :type
                    , e.eno
                    , false
                FROM
                    employee e
                WHERE
                    e.eno > 0 AND e.eno < 1000
                RETURNING *
                )
                SELECT * FROM ins
                """;

        Query q = em.createNativeQuery(cteSql, NotificationEntity.class);
        q.setParameter("title", dto.getTitle());
        q.setParameter("message", dto.getMessage());
        q.setParameter("type", dto.getType() != null
                ? dto.getType().name()
                : NotificationType.normal.name());

        @SuppressWarnings("unchecked")
        List<NotificationEntity> inserted = (List<NotificationEntity>) q.getResultList();

        return inserted;
    }
}
