package com.kh.team119.meal.repository;

import com.kh.team119.meal.entity.MealEntryEntity;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public interface MealEntryRepository extends JpaRepository<MealEntryEntity, Long> {

    @EntityGraph(attributePaths = {"items", "items.food"})
    List<MealEntryEntity> findByEmployee_EnoAndEatDateAndDeletedAtIsNull(Long employeeNo, LocalDate date);

    @EntityGraph(attributePaths = {"items", "items.food"})
    List<MealEntryEntity> findByEmployee_EnoAndEatDateBetweenAndDeletedAtIsNull(Long employeeNo, LocalDate from, LocalDate to);

    @Query("""
            select m.eatDate as date, sum(m.totalKcal) as total
            from MealEntryEntity m
            where m.employee.eno = :empNo 
              and m.eatDate between :from and :to
              and m.deletedAt is null
            group by m.eatDate
            order by m.eatDate
            """)
    List<DailyTotal> sumDailyTotal(Long empNo, LocalDate from, LocalDate to);

    interface DailyTotal {
        LocalDate getDate();
        BigDecimal getTotal();
    }

    // === 여기서부터 추가 ===

    // 기간 조회: meal → items → food 한 번에 로딩 (N+1 제거)
    @Query("""
        select distinct m
        from MealEntryEntity m
        join fetch m.items i
        join fetch i.food f
        where m.employee.eno = :empNo
          and m.eatDate between :from and :to
          and m.deletedAt is null
        order by m.eatDate asc, m.mealType asc, i.itemNo asc
    """)
    List<MealEntryEntity> findWithItemsAndFoodByEmployeeAndEatDateBetween(
            @Param("empNo") Long empNo,
            @Param("from") LocalDate from,
            @Param("to") LocalDate to
    );

    // 하루 조회: meal → items → food 한 번에 로딩
    @Query("""
        select distinct m
        from MealEntryEntity m
        join fetch m.items i
        join fetch i.food f
        where m.employee.eno = :empNo
          and m.eatDate = :date
          and m.deletedAt is null
        order by m.mealType asc, i.itemNo asc
    """)
    List<MealEntryEntity> findWithItemsAndFoodByEmployeeAndEatDate(
            @Param("empNo") Long empNo,
            @Param("date") LocalDate date
    );
}
