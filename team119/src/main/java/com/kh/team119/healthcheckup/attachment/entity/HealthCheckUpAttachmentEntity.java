package com.kh.team119.healthcheckup.attachment.entity;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.healthcheckup.snapshot.entity.HealthCheckUpSnapshotEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(
        name = "HEALTH_CHECKUP_ATTACHMENT",
        uniqueConstraints = @UniqueConstraint(
                name = "UK_HEALTH_CHECKUP_ATTACHMENT_FILENAME",
                columnNames = {"fileName"}
        )
)
@Getter
@Builder
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@AllArgsConstructor(access = lombok.AccessLevel.PRIVATE)
@ToString
public class HealthCheckUpAttachmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long hcno;

    @OneToOne(mappedBy = "attachmentEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    private HealthCheckUpSnapshotEntity snapshotEntity;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employeeNo", nullable = false, foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_HEALTH_CHECKUP_ATTACHMENT"))
    private EmployeeEntity employeeEntity;

    @Column(columnDefinition = "VARCHAR(256)", nullable = false, unique = true)
    private String fileName;
    @Column(columnDefinition = "VARCHAR(256)", nullable = false)
    private String originalFileName;

    @Builder.Default
    @Column(columnDefinition = "TIMESTAMP DEFAULT LOCALTIMESTAMP", nullable = false, updatable = false)
    private LocalDateTime registeredAt = LocalDateTime.now();

    @Builder.Default
    @Column(columnDefinition = "TIMESTAMP DEFAULT NULL", insertable = false)
    private LocalDateTime updatedAt = null;

    @Builder.Default
    @Column(columnDefinition = "TIMESTAMP DEFAULT NULL", insertable = false)
    private LocalDateTime deletedAt = null;

    public void replaceFileName(String newFileName, String originalFilename) {
        this.fileName = newFileName;
        this.originalFileName = originalFilename;
        this.updatedAt = LocalDateTime.now();
    }
}
