package com.kh.team119.welfarepointrecord.entity;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.welfarepointrecord.OccurrenceType;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "WELFARE_POINT_RECORD")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class WelfarePointRecordEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "eno", nullable = false, foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_WELFARE_POINT_RECORD"))
    private EmployeeEntity employeeEntity;

    @Enumerated(EnumType.STRING)
    @Column(length = 10, nullable = false)
    private OccurrenceType occurrenceType;

    @Builder.Default
    @Column(nullable = false)
    private LocalDateTime occurrenceAt = LocalDateTime.now();

    private Long beforeValue;
    private Long afterValue;
    private Long amount;

    private String description;

}
