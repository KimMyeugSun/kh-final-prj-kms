package com.kh.team119.exercise.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "EXERCISE_CATALOG")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseCatalogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "exno")
    private Long exerciseNo;

    @Column(name = "exercise_name", length = 100, nullable = false)
    private String exerciseName;

    // 단위체중당 분당 에너지 소비량 (kcal/kg/min)
    @Column(name = "energy_per_kg_hr", precision = 6, scale = 2, nullable = false)
    private BigDecimal energyPerKgHr;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "type_no", nullable = false, foreignKey = @ForeignKey(name = "FK_EXERCISE_TYPE_TO_EXERCISE_CATALOG"))
    @JsonIgnoreProperties({"hibernateLazyInitializer", "handler"}) // 직렬화 제외
    private ExerciseTypeEntity type;

    @Column(name = "memo", length = 500)
    private String memo;
}
