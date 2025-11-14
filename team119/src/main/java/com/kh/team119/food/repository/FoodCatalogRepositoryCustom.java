package com.kh.team119.food.repository;

import com.kh.team119.food.entity.FoodCatalogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface FoodCatalogRepositoryCustom {
    Page<FoodCatalogEntity> search(String q, Pageable pageable);
}
