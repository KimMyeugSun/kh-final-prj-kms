package com.kh.team119.healthcheckup.attachment.repository;

import com.kh.team119.healthcheckup.attachment.entity.HealthCheckUpAttachmentEntity;

import java.util.List;

public interface HealthCheckUpAttachmentRepositoryDSL {
    List<HealthCheckUpAttachmentEntity> findAllByEnoAndDeletedAtIsNull(Long eno);

    HealthCheckUpAttachmentEntity findByEnoAndHcnoAndDeletedAtIsNull(Long eno, Long hcno);

    HealthCheckUpAttachmentEntity deleteByEnoAndHcnoAndDeletedAtIsNull(Long eno, Long hcno);
}
