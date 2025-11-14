package com.kh.team119.rank.entity;


import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "RANKING_PERIOD")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class RankingPeriodEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(nullable = false)
    private String rankingName;

    @Column(name = "cno", nullable = false)
    private Long cno;
    
}
