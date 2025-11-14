package com.kh.team119.exercise.repository;

import com.kh.team119.exercise.entity.ExerciseEntryEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface ExerciseEntryRepository extends JpaRepository<ExerciseEntryEntity, Long> {

    // 엔트리 목록 조회 시 exercise, exercise.type까지 한 번에 로딩 (N+1 제거)
    @EntityGraph(attributePaths = {"exercise", "exercise.type"})
    List<ExerciseEntryEntity> findByEmployee_EnoAndWorkDateBetween(Long empNo, LocalDate from, LocalDate to);

    @EntityGraph(attributePaths = {"exercise", "exercise.type"})
    List<ExerciseEntryEntity> findByEmployee_EnoAndWorkDate(Long empNo, LocalDate date);

    // 단건 조회도 DTO 변환/직렬화 중 접근 시 N+1 방지
    @Override
    @EntityGraph(attributePaths = {"exercise", "exercise.type"})
    Optional<ExerciseEntryEntity> findById(Long id);

    /** 달력용: 특정 기간 내 일자별 총 소모 칼로리 */
    @Query("""
            select new com.kh.team119.exercise.repository.ExerciseEntryRepository$DailyBurnImpl(
                e.workDate,
                coalesce(sum(e.kcalBurned), 0)
            )
            from ExerciseEntryEntity e
            where e.employee.eno = :empNo
              and e.workDate between :from and :to
            group by e.workDate
            order by e.workDate
            """)
    List<DailyBurn> sumDailyBurn(@Param("empNo") Long empNo,
                                 @Param("from") LocalDate from,
                                 @Param("to") LocalDate to);

    void deleteAllByEmployee_EnoAndWorkDate(Long eno, LocalDate workDate);

    interface DailyBurn {
        LocalDate getDate();
        BigDecimal getKcal();
    }

    class DailyBurnImpl implements DailyBurn {
        private final LocalDate date;
        private final BigDecimal kcal;

        public DailyBurnImpl(LocalDate date, Number kcal) {
            this.date = date;
            this.kcal = (kcal == null) ? BigDecimal.ZERO : new BigDecimal(kcal.toString());
        }

        @Override
        public LocalDate getDate() { return date; }

        @Override
        public BigDecimal getKcal() { return kcal; }
    }
}
