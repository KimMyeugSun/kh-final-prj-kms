package com.kh.team119.meal.repository;

import com.kh.team119.meal.entity.MealFoodItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface MealFoodItemRepository extends JpaRepository<MealFoodItemEntity, Long> {
    List<MealFoodItemEntity> findByMeal_MealNo(Long mealNo);
}
