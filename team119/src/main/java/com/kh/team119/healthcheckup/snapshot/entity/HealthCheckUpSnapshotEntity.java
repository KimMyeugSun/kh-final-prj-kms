package com.kh.team119.healthcheckup.snapshot.entity;

import com.kh.team119.healthcheckup.attachment.entity.HealthCheckUpAttachmentEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "HEALTH_CHECKUP_SNAPSHOT")
@Getter
@Builder
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@AllArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class HealthCheckUpSnapshotEntity {

    @Id
    private Long hcno;

    @OneToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "hcno", nullable = false)
    @MapsId
    private HealthCheckUpAttachmentEntity attachmentEntity;

}
