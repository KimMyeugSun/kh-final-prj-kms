package com.kh.team119.exercise.repository;

import com.kh.team119.exercise.entity.WorkoutRoutineEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface WorkoutRoutineRepository extends JpaRepository<WorkoutRoutineEntity, Long> {
    @EntityGraph(attributePaths = {"items", "items.exercise", "employee"})
    List<WorkoutRoutineEntity> findByEmployee_Eno(Long empNo);
}
