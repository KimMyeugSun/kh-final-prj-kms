package com.kh.team119.exercise.repository;

import com.kh.team119.exercise.entity.WorkoutRoutineItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface WorkoutRoutineItemRepository extends JpaRepository<WorkoutRoutineItemEntity, Long> {
}
