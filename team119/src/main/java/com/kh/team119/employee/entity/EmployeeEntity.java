package com.kh.team119.employee.entity;

import com.kh.team119.department.entity.DepartmentEntity;
import com.kh.team119.employee.EmpGradeType;
import com.kh.team119.healthcheckup.attachment.entity.HealthCheckUpAttachmentEntity;
import com.kh.team119.notification.entity.NotificationEntity;
import com.kh.team119.role.entity.RoleEntity;
import com.kh.team119.tag.entity.EmpTagEntity;
import com.kh.team119.welfarepointrecord.entity.WelfarePointRecordEntity;
import jakarta.persistence.*;
import lombok.*;
import org.hibernate.annotations.BatchSize;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Entity
@Table(name = "EMPLOYEE",
        indexes = {
                @Index(name = "IDX_EMPLOYEE_NO", columnList = "eno"),
                @Index(name = "IDX_EMPLOYEE_ID", columnList = "empId"),
                @Index(name = "IDX_EMPLOYEE_EMAIL", columnList = "empEmail"),
                @Index(name = "IDX_EMPLOYEE_PHONE", columnList = "empPhone"),
                @Index(name = "IDX_DEPARTMENT", columnList = "dno")
        },
        uniqueConstraints = {
                @UniqueConstraint(name = "UK_EMPLOYEE_ID", columnNames = {"empId"}),
                @UniqueConstraint(name = "UK_EMPLOYEE_EMAIL", columnNames = {"empEmail"}),
                @UniqueConstraint(name = "UK_EMPLOYEE_PHONE", columnNames = {"empPhone"}),
                @UniqueConstraint(name = "UK_EMPLOYEE_DEPARTMENT", columnNames = {"dno"})
        }
)
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class EmployeeEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long eno;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "dno", nullable = false, foreignKey = @ForeignKey(name = "FK_DEPARTMENT_NO_TO_EMPLOYEE"))
    private DepartmentEntity departmentEntity;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 32)
    private EmpGradeType empPosition;

    @Column(columnDefinition = "VARCHAR(64)", nullable = false)
    private String empName;
    @Column(columnDefinition = "VARCHAR(64)", nullable = false)
    private String empId;
    @Column(columnDefinition = "VARCHAR(256)", nullable = false)
    private String empPwd;

    @Builder.Default
    @Column(columnDefinition = "VARCHAR(256)")
    private String empProfileName = null;

    @Column(columnDefinition = "VARCHAR(128)", nullable = false)
    private String empEmail;
    @Column(columnDefinition = "VARCHAR(32)", nullable = false)
    private String empPhone;
    @Column(columnDefinition = "VARCHAR(256)", nullable = false)
    private String empAddress;
    @Column(columnDefinition = "VARCHAR(256)", nullable = false)
    private String empAddressDetail;

    @Builder.Default
    @Column(columnDefinition = "BIGINT DEFAULT 0", nullable = false)
    private Long welfarePoints = 0L;

    @Builder.Default
    @Column(columnDefinition = "TIMESTAMP DEFAULT LOCALTIMESTAMP", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(columnDefinition = "TIMESTAMP DEFAULT NULL", insertable = false)
    private LocalDateTime updatedAt = null;

    @Builder.Default
    @Column(columnDefinition = "TIMESTAMP DEFAULT NULL", insertable = false)
    private LocalDateTime deletedAt = null;

    @Builder.Default
    @OneToMany(mappedBy = "employeeEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 100)
    private Set<RoleEntity> roles = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "employeeEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 100)
    private List<WelfarePointRecordEntity> welfarePointRecordEntity = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "employeeEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 100)
    private Set<EmpTagEntity> tags = new HashSet<>();

    @Builder.Default
    @OneToMany(mappedBy = "employeeEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 100)
    private List<HealthCheckUpAttachmentEntity> healthCheckUpAttachments = new ArrayList<>();

    @Builder.Default
    @OneToMany(mappedBy = "employeeEntity", fetch = FetchType.LAZY, cascade = CascadeType.ALL, orphanRemoval = true)
    @BatchSize(size = 100)
    private List<NotificationEntity> notifications = new ArrayList<>();

    public void grant(RoleEntity role) {
        if (role == null) return;
        if (this.roles == null) this.roles = new HashSet<>();
        this.roles.add(role);

        role.setEmployee(this); // 양방향 연관관계 주인 설정
    }

    public void revoke(RoleEntity role) {
        if (role == null || this.roles == null) return;
        this.roles.remove(role);

        role.setEmployee(null); // 양방향 연관관계 주인 해제
    }

    public void changeProfile(String fileName) {
        this.empProfileName = fileName;
        this.updatedAt = LocalDateTime.now();
    }

    public void changePassword(String encodedPwd) {
        this.empPwd = encodedPwd;
        this.updatedAt = LocalDateTime.now();
    }

    public void addWelfarePoints(Long points) {
        this.welfarePoints = welfarePoints + points;
        this.updatedAt = LocalDateTime.now();
    }

    public void minusWelfarePoints(Long points) {
        this.welfarePoints = Math.max(0, welfarePoints - points);
        this.updatedAt = LocalDateTime.now();
    }
    public void addTag(EmpTagEntity tag) {
        this.tags.add(tag);
        tag.setEmployee(this);
    }

    public void removeTag(EmpTagEntity tag) {
        if (tag == null || this.tags == null) return;
        this.tags.remove(tag);
        tag.setEmployee(null);
    }
}
