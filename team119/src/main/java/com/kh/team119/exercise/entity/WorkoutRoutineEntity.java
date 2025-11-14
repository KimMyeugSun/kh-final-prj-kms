package com.kh.team119.exercise.entity;

import com.kh.team119.employee.entity.EmployeeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "WORKOUT_ROUTINE")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutRoutineEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ROUTINE_NO")
    private Long routineNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "EMPLOYEE_NO", nullable = false,
            foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_WORKOUT_ROUTINE"))
    private EmployeeEntity employee;

    @Column(name = "ROUTINE_NAME", length = 100, nullable = false)
    private String routineName;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @OneToMany(mappedBy = "routine", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<WorkoutRoutineItemEntity> items = new ArrayList<>();
}
