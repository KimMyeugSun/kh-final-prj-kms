package com.kh.team119.exercise.service;

import com.kh.team119.exercise.entity.ExerciseCatalogEntity;
import com.kh.team119.exercise.repository.ExerciseCatalogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class ExerciseCatalogService {
    private final ExerciseCatalogRepository repo;

    public Page<ExerciseCatalogEntity> list(String q, Pageable pageable) {
        return (q == null || q.isBlank())
                ? repo.findBy(pageable) // 변경
                : repo.findByExerciseNameContainingIgnoreCase(q.trim(), pageable);
    }

    public ExerciseCatalogEntity get(Long id) {
        return repo.findById(id).orElseThrow();
    }
}
