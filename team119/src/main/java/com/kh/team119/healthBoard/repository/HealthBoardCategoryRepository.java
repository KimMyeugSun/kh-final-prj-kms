package com.kh.team119.healthBoard.repository;

import com.kh.team119.healthBoard.entity.CategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface HealthBoardCategoryRepository extends JpaRepository<CategoryEntity, Long> {
}
