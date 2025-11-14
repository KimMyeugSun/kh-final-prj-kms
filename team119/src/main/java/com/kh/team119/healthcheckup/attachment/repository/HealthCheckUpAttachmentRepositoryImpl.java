package com.kh.team119.healthcheckup.attachment.repository;

import com.kh.team119.healthcheckup.attachment.entity.HealthCheckUpAttachmentEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

import static com.kh.team119.healthcheckup.attachment.entity.QHealthCheckUpAttachmentEntity.healthCheckUpAttachmentEntity;

@RequiredArgsConstructor
public class HealthCheckUpAttachmentRepositoryImpl implements HealthCheckUpAttachmentRepositoryDSL {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<HealthCheckUpAttachmentEntity> findAllByEnoAndDeletedAtIsNull(Long eno) {

        return jpaQueryFactory
                .selectFrom(healthCheckUpAttachmentEntity)
                .where(
                        healthCheckUpAttachmentEntity.employeeEntity.eno.eq(eno)
                                .and(healthCheckUpAttachmentEntity.deletedAt.isNull())
                )
                .orderBy(healthCheckUpAttachmentEntity.registeredAt.desc())
                .fetch();
    }

    @Override
    public HealthCheckUpAttachmentEntity findByEnoAndHcnoAndDeletedAtIsNull(Long eno, Long hcno) {
        return jpaQueryFactory
                .selectFrom(healthCheckUpAttachmentEntity)
                .where(
                        healthCheckUpAttachmentEntity.employeeEntity.eno.eq(eno)
                                .and(healthCheckUpAttachmentEntity.hcno.eq(hcno))
                                .and(healthCheckUpAttachmentEntity.deletedAt.isNull())
                )
                .fetchOne();
    }

    @Override
    public HealthCheckUpAttachmentEntity deleteByEnoAndHcnoAndDeletedAtIsNull(Long eno, Long hcno) {
        jpaQueryFactory
                .update(healthCheckUpAttachmentEntity)
                .set(healthCheckUpAttachmentEntity.deletedAt, LocalDateTime.now())
                .where(
                        healthCheckUpAttachmentEntity.employeeEntity.eno.eq(eno)
                                .and(healthCheckUpAttachmentEntity.hcno.eq(hcno))
                                .and(healthCheckUpAttachmentEntity.deletedAt.isNull())
                )
                .execute();

        return jpaQueryFactory
                .selectFrom(healthCheckUpAttachmentEntity)
                .where(
                        healthCheckUpAttachmentEntity.employeeEntity.eno.eq(eno)
                                .and(healthCheckUpAttachmentEntity.hcno.eq(hcno))
                )
                .fetchOne();

    }
}
