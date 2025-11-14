package com.kh.team119.meal.entity;

import com.kh.team119.food.entity.FoodCatalogEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Table(name = "MEAL_FOOD_ITEM")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealFoodItemEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "ITEM_NO")
    private Long itemNo;

    @ManyToOne(fetch = LAZY /*, cascade = NONE */)
    @JoinColumn(name = "MEAL_NO", nullable = false,
            foreignKey = @ForeignKey(name = "FK_MEAL_NO_TO_MEAL_FOOD_ITEM"))
    private MealEntryEntity meal;

    @ManyToOne(fetch = LAZY /*, cascade = NONE */)
    @JoinColumn(name = "FOOD_NO", nullable = false,
            foreignKey = @ForeignKey(name = "FK_FOOD_NO_TO_MEAL_FOOD_ITEM"))
    private FoodCatalogEntity food;

    @Column(name = "SERVINGS", precision = 6, scale = 1, nullable = false)
    private BigDecimal servings;

    @Column(name = "MEMO", length = 300)
    private String memo;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;
}
