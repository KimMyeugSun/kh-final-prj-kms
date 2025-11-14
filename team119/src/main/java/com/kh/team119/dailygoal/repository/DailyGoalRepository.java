package com.kh.team119.dailygoal.repository;

import com.kh.team119.dailygoal.entity.DailyGoalEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyGoalRepository extends JpaRepository<DailyGoalEntity, Long> {
    List<DailyGoalEntity> findByEmployee_EnoAndGoalDate(Long empNo, LocalDate goalDate);

    Optional<DailyGoalEntity> findByEmployee_EnoAndGoalDateAndItemId(Long empNo, LocalDate goalDate, String itemId);

    void deleteByEmployee_EnoAndGoalDateAndItemId(Long eno, LocalDate workDate, String s);
}
