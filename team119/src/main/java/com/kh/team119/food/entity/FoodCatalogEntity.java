package com.kh.team119.food.entity;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;

@Entity
@Table(name = "FOOD_CATALOG")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FoodCatalogEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "FOOD_NO")
    private Long foodNo;

    @Column(name = "FOOD_NAME", length = 100, nullable = false)
    private String name;

    @Column(name = "SERVING_DESC", length = 100)
    private String servingDesc; // 1컵, 1회분, 200g

    @Column(name = "KCAL", precision = 6, scale = 1)
    private BigDecimal kcal;
    @Column(name = "PROTEIN", precision = 6, scale = 1)
    private BigDecimal protein;
    @Column(name = "CALCIUM", precision = 6, scale = 1)
    private BigDecimal calcium;
    @Column(name = "VITAMIN_A", precision = 6, scale = 1)
    private BigDecimal vitaminA;
    @Column(name = "VITAMIN_B1", precision = 6, scale = 1)
    private BigDecimal vitaminB1;
    @Column(name = "VITAMIN_B2", precision = 6, scale = 1)
    private BigDecimal vitaminB2;

    @Column(name = "MEMO", length = 300)
    private String memo;

    // meal 연관관계는 meal 모듈 만들 때 추가
}
