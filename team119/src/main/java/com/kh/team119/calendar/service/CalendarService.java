package com.kh.team119.calendar.service;

import com.kh.team119.calendar.dto.CalendarDtos;
import com.kh.team119.exercise.entity.ExerciseEntryEntity;
import com.kh.team119.exercise.repository.ExerciseEntryRepository;
import com.kh.team119.meal.entity.MealEntryEntity;
import com.kh.team119.meal.entity.MealFoodItemEntity;
import com.kh.team119.meal.entity.MealType;
import com.kh.team119.meal.repository.MealEntryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.*;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CalendarService {

    private final MealEntryRepository mealRepo;
    private final ExerciseEntryRepository workoutRepo;

    public List<CalendarDtos.Event> listEvents(Long empNo, LocalDate from, LocalDate to) {
        List<CalendarDtos.Event> out = new ArrayList<>();

        // 식사 엔트리 모두 조회
        List<MealEntryEntity> meals = mealRepo.findByEmployee_EnoAndEatDateBetweenAndDeletedAtIsNull(empNo, from, to);

        // 날짜 + 식사타입별 그룹핑
        Map<LocalDate, Map<MealType, List<MealEntryEntity>>> grouped = meals.stream()
                .collect(Collectors.groupingBy(
                        MealEntryEntity::getEatDate,
                        Collectors.groupingBy(MealEntryEntity::getMealType)
                ));

        for (var entry : grouped.entrySet()) {
            LocalDate date = entry.getKey();
            Map<MealType, List<MealEntryEntity>> byType = entry.getValue();

            for (var typeEntry : byType.entrySet()) {
                MealType type = typeEntry.getKey();
                List<MealEntryEntity> list = typeEntry.getValue();

                BigDecimal kcal = list.stream()
                        .map(MealEntryEntity::getTotalKcal)
                        .filter(Objects::nonNull)
                        .reduce(BigDecimal.ZERO, BigDecimal::add);

                List<String> foodNames = list.stream()
                        .flatMap(m -> m.getItems().stream())
                        .map(it -> it.getFood().getName())
                        .distinct()
                        .toList();

                out.add(CalendarDtos.Event.builder()
                        .id("meal-" + date + "-" + type.name())
                        .date(date)
                        .type("meal")
                        .mealType(type.name())   // BRE, LUN, DIN
                        .title(kcal.stripTrailingZeros().toPlainString() + "kcal")
                        .kcal(kcal)
                        .items(foodNames)
                        .build());
            }
        }

        // 운동
        List<ExerciseEntryEntity> workouts = workoutRepo.findByEmployee_EnoAndWorkDateBetween(empNo, from, to);
        Map<LocalDate, List<ExerciseEntryEntity>> workoutsByDate = workouts.stream()
                .collect(Collectors.groupingBy(ExerciseEntryEntity::getWorkDate));

        for (var entry : workoutsByDate.entrySet()) {
            LocalDate date = entry.getKey();
            List<ExerciseEntryEntity> list = entry.getValue();

            BigDecimal kcal = list.stream()
                    .map(ExerciseEntryEntity::getKcalBurned)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);

            List<String> workoutNames = list.stream()
                    .map(w -> w.getExercise().getExerciseName())
                    .distinct()
                    .toList();

            out.add(CalendarDtos.Event.builder()
                    .id("workout-" + date)
                    .date(date)
                    .type("workout")
                    .title(kcal.stripTrailingZeros().toPlainString() + "kcal")
                    .kcal(kcal)
                    .items(workoutNames)
                    .build());
        }

        return out;
    }


    /**
     * 하루 식사 상세
     */
    public CalendarDtos.MealDetailResp getMealDetail(Long empNo, LocalDate date) {
        List<MealEntryEntity> entries =
                mealRepo.findByEmployee_EnoAndEatDateAndDeletedAtIsNull(empNo, date);

        Map<String, List<MealEntryEntity>> byType = entries.stream()
                .collect(Collectors.groupingBy(e -> e.getMealType().name()));

        List<CalendarDtos.MealSection> sections = new ArrayList<>();
        BigDecimal dayTotal = BigDecimal.ZERO;

        for (Map.Entry<String, List<MealEntryEntity>> e : byType.entrySet()) {
            String mealType = e.getKey();
            List<MealEntryEntity> list = e.getValue();

            BigDecimal sectionTotal = BigDecimal.ZERO;
            List<CalendarDtos.MealItem> items = new ArrayList<>();

            for (MealEntryEntity m : list) {
                sectionTotal = sectionTotal.add(m.getTotalKcal() == null ? BigDecimal.ZERO : m.getTotalKcal());

                for (MealFoodItemEntity it : m.getItems()) {
                    var food = it.getFood();
                    BigDecimal servings = it.getServings() == null ? BigDecimal.ONE : it.getServings();
                    BigDecimal baseKcal = food.getKcal() == null ? BigDecimal.ZERO : food.getKcal();
                    BigDecimal itemKcal = baseKcal.multiply(servings);

                    String unitDesc = (food.getServingDesc() == null || food.getServingDesc().isBlank())
                            ? "" : food.getServingDesc();
                    String servingDesc = servings.stripTrailingZeros().toPlainString() + "인분"
                            + (unitDesc.isEmpty() ? "" : " (" + unitDesc + ")");

                    items.add(CalendarDtos.MealItem.builder()
                            .foodName(food.getName())
                            .servings(servings)
                            .servingDesc(servingDesc)
                            .kcal(itemKcal)
                            .build());
                }
            }

            sections.add(CalendarDtos.MealSection.builder()
                    .mealType(mealType)
                    .totalKcal(sectionTotal)
                    .items(items)
                    .build());

            dayTotal = dayTotal.add(sectionTotal);
        }

        return CalendarDtos.MealDetailResp.builder()
                .date(date)
                .dayTotal(dayTotal)
                .sections(sections.stream()
                        .sorted(Comparator.comparing(s -> orderOf(s.getMealType())))
                        .toList())
                .build();
    }

    private int orderOf(String mealTypeName) {
        return switch (mealTypeName) {
            case "BRE", "BREAKFAST", "아침" -> 1;
            case "LUN", "LUNCH", "점심" -> 2;
            case "DIN", "DINNER", "저녁" -> 3;
            default -> 9;
        };
    }

    /**
     * 하루 운동 상세
     */
    public CalendarDtos.WorkoutDetail getWorkoutDetail(Long empNo, LocalDate date) {
        List<ExerciseEntryEntity> list = workoutRepo.findByEmployee_EnoAndWorkDate(empNo, date);

        BigDecimal total = list.stream()
                .map(ExerciseEntryEntity::getKcalBurned)
                .filter(Objects::nonNull)
                .reduce(BigDecimal.ZERO, BigDecimal::add);

        // 하루 대표 메모 (첫 번째 운동 기록 기준)
        String dayMemo = list.isEmpty() ? null : list.get(0).getMemo();

        return CalendarDtos.WorkoutDetail.builder()
                .date(date)
                .totalKcal(total == null ? BigDecimal.ZERO : total)
                .dayMemo(dayMemo)
                .items(list.stream().map(w ->
                        CalendarDtos.WorkoutItem.builder()
                                .sessionNo(w.getSessionNo())
                                .exerciseName(w.getExercise().getExerciseName())
                                .durationMin(w.getDurationMin())
                                .kcal(w.getKcalBurned())
                                .memo(w.getMemo())
                                .build()
                ).toList())
                .build();
    }


    public void updateWorkoutMemo(Long sessionNo, String memo) {
        ExerciseEntryEntity e = workoutRepo.findById(sessionNo).orElseThrow();
        e.setMemo(memo);
        workoutRepo.save(e);
    }

    public void deleteWorkout(Long sessionNo) {
        workoutRepo.deleteById(sessionNo);
    }
}
