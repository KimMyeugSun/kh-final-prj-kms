package com.kh.team119.healthcheckup.attachment.repository;

import com.kh.team119.healthcheckup.attachment.entity.HealthCheckUpAttachmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HealthCheckUpAttachmentRepository extends JpaRepository<HealthCheckUpAttachmentEntity, Long>, HealthCheckUpAttachmentRepositoryDSL {
}