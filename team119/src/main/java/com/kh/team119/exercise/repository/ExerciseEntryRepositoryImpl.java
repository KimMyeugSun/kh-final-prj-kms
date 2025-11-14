package com.kh.team119.exercise.repository;

import com.kh.team119.exercise.entity.QExerciseEntryEntity;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
@RequiredArgsConstructor
public class ExerciseEntryRepositoryImpl implements ExerciseEntryRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ExerciseEntryRepository.DailyBurn> sumDailyBurn(Long empNo, LocalDate from, LocalDate to) {
        QExerciseEntryEntity e = QExerciseEntryEntity.exerciseEntryEntity;

        return queryFactory
                .select(Projections.constructor(DailyBurnDto.class, e.workDate, e.kcalBurned.sum()))
                .from(e)
                .where(
                        e.employee.eno.eq(empNo),
                        e.workDate.between(from, to)
                )
                .groupBy(e.workDate)
                .orderBy(e.workDate.asc())
                .fetch()
                .stream()
                .map(d -> (ExerciseEntryRepository.DailyBurn) d)
                .toList();
    }

    public static class DailyBurnDto implements ExerciseEntryRepository.DailyBurn {
        private final java.time.LocalDate date;
        private final java.math.BigDecimal kcal;

        public DailyBurnDto(java.time.LocalDate date, java.math.BigDecimal kcal) {
            this.date = date;
            this.kcal = kcal;
        }

        @Override
        public java.time.LocalDate getDate() {
            return date;
        }

        @Override
        public java.math.BigDecimal getKcal() {
            return kcal;
        }
    }
}
