package com.kh.team119.food.repository;

import com.kh.team119.food.entity.FoodCatalogEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface FoodCatalogRepository extends JpaRepository<FoodCatalogEntity, Long>, FoodCatalogRepositoryCustom{
    Optional<FoodCatalogEntity> findFirstByNameIgnoreCase(String name);
}
