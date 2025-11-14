package com.kh.team119.exercise.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.kh.team119.employee.entity.EmployeeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Table(name = "EXERCISE_ENTRY")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseEntryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "SESSION_NO")
    private Long sessionNo;

    @ManyToOne(fetch = LAZY /*, cascade = NONE */)
    @JoinColumn(name = "EMPLOYEE_NO", nullable = false,
            foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_EXERCISE_ENTRY"))
    private EmployeeEntity employee;

    @ManyToOne(fetch = LAZY /*, cascade = NONE */)
    @JoinColumn(name = "EXERCISE_NO", nullable = false,
            foreignKey = @ForeignKey(name = "FK_EXERCISE_NO_TO_EXERCISE_ENTRY"))
    private ExerciseCatalogEntity exercise;

    @Column(name = "WORK_DATE", nullable = false)
    private LocalDate workDate;

    @Column(name = "DURATION_MIN", nullable = false)
    private Integer durationMin;

    @Column(name = "WEIGHT_KG", precision = 5, scale = 1, nullable = false)
    private BigDecimal weightKg;

    @Column(name = "KCAL_BURNED", precision = 7, scale = 1, nullable = false)
    private BigDecimal kcalBurned;

    @Column(name = "DONE_YN", length = 1, nullable = false)
    private String doneYn;

    @Column(name = "MEMO", length = 1000)
    private String memo;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;
}
