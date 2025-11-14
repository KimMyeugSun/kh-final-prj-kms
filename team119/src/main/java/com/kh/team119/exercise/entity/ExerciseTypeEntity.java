// com/kh/team119/exercise/entity/ExerciseTypeEntity.java
package com.kh.team119.exercise.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "EXERCISE_TYPE",
        uniqueConstraints = @UniqueConstraint(
                name = "UK_EXERCISE_TYPE_CODE",
                columnNames = {"type_code"}
        )
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ExerciseTypeEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "type_no")
    private Integer typeNo;

    @Column(name = "type_code", length = 20, nullable = false, unique = true)
    private String typeCode;   // CARDIO / STRENGTH / SPORTS / PILATES / OTHER~

    @Column(name = "type_name", length = 50, nullable = false)
    private String typeName;   // 유산소 / 근력운동 / 스포츠 / 체조 / 기타~
}
