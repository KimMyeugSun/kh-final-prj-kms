package com.kh.team119.notification.entity;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.notification.dto.NotificationType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "NOTIFICATION")
@Getter
@Builder
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@AllArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class NotificationEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long nno;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "eno", nullable = false, foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_NOTIFICATION"))
    private EmployeeEntity employeeEntity;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(32)", nullable = false)
    private NotificationType notificationType = NotificationType.normal;

    @Column(columnDefinition = "VARCHAR(32)", nullable = false)
    private String title;

    @Column(columnDefinition = "VARCHAR(64)", nullable = false)
    private String message;

    @Builder.Default
    @Column(columnDefinition = "BOOLEAN", nullable = false)
    private boolean isRead = false;
}
