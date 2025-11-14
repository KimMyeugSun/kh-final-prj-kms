package com.kh.team119.exercise.repository;


import com.kh.team119.exercise.entity.ExerciseCatalogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ExerciseCatalogRepositoryCustom {
    Page<ExerciseCatalogEntity> search(String type, String q, Pageable pageable);
}
