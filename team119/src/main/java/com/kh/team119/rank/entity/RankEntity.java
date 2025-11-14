package com.kh.team119.rank.entity;


import com.kh.team119.employee.entity.EmployeeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "RANKING")
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class RankEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Builder.Default
    private Long score = 0L;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "eno", nullable = false, foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_RANKING"))
    private EmployeeEntity employee;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "ranking_period_no", nullable = false, foreignKey = @ForeignKey(name = "FK_RANKING_PERIOD_NO_TO_RANKING"))
    private RankingPeriodEntity rankingPeriod;

    private LocalDateTime deletedAt;


    public void updateScore(Long score) {
        this.score = score;
    }
}
