package com.kh.team119.exercise.repository;

import java.time.LocalDate;
import java.util.List;

public interface ExerciseEntryRepositoryCustom {
    List<ExerciseEntryRepository.DailyBurn> sumDailyBurn(Long empNo, LocalDate from, LocalDate to);
}

