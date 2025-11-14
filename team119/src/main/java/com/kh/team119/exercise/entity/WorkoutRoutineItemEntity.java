package com.kh.team119.exercise.entity;

import jakarta.persistence.*;
import lombok.*;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Table(name = "WORKOUT_ROUTINE_ITEM")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class WorkoutRoutineItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ITEM_NO")
    private Long itemNo;

    @ManyToOne(fetch = LAZY /*, cascade = NONE */)
    @JoinColumn(name = "ROUTINE_NO", nullable = false,
            foreignKey = @ForeignKey(name = "FK_WORKOUT_ROUTINE_TO_ITEM"))
    private WorkoutRoutineEntity routine;

    @ManyToOne(fetch = LAZY /*, cascade = NONE */)
    @JoinColumn(name = "EXERCISE_NO", nullable = false,
            foreignKey = @ForeignKey(name = "FK_EXERCISE_CATALOG_TO_ITEM"))
    private ExerciseCatalogEntity exercise;

    // 기본 권장 시간(분)
    @Column(name = "DEFAULT_MIN", nullable = false)
    private Integer defaultMin;
}
