package com.kh.team119.exercise.repository;

import com.kh.team119.exercise.entity.ExerciseCatalogEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ExerciseCatalogRepository extends JpaRepository<ExerciseCatalogEntity, Long>, ExerciseCatalogRepositoryCustom {

    // 전체 목록(페이지) + type 조인 로딩
    @EntityGraph(attributePaths = "type")
    Page<ExerciseCatalogEntity> findBy(Pageable pageable);

    @EntityGraph(attributePaths = "type")
    Page<ExerciseCatalogEntity> findByExerciseNameContainingIgnoreCase(String q, Pageable pageable);

    @EntityGraph(attributePaths = "type")
    Page<ExerciseCatalogEntity> findByType_TypeCode(String typeCode, Pageable pageable);

    @EntityGraph(attributePaths = "type")
    Page<ExerciseCatalogEntity> findByType_TypeCodeAndExerciseNameContainingIgnoreCase(
            String typeCode, String q, Pageable pageable);
}
