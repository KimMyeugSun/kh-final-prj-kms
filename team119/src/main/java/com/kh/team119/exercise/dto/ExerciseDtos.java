package com.kh.team119.exercise.dto;

import com.kh.team119.exercise.entity.ExerciseCatalogEntity;
import com.kh.team119.exercise.entity.ExerciseEntryEntity;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;

public class ExerciseDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateReq {
        private Long empNo;
        private Long exerciseNo;
        private LocalDate workDate;
        private Integer durationMin;
        private BigDecimal weightKg;
        private String memo;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Resp {
        private Long sessionNo;
        private Long empNo;
        private Long exerciseNo;
        private String exerciseName;
        private LocalDate workDate;
        private Integer durationMin;
        private BigDecimal weightKg;
        private BigDecimal kcalBurned;
        private String memo;

        public static Resp from(ExerciseEntryEntity e) {
            return Resp.builder()
                    .sessionNo(e.getSessionNo())
                    .empNo(e.getEmployee().getEno()) // Entity 내부 eno → 외부 empNo
                    .exerciseNo(e.getExercise().getExerciseNo())
                    .exerciseName(e.getExercise().getExerciseName())
                    .workDate(e.getWorkDate())
                    .durationMin(e.getDurationMin())
                    .weightKg(e.getWeightKg())
                    .kcalBurned(e.getKcalBurned())
                    .memo(e.getMemo())
                    .build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CatalogResp {
        private Long exerciseNo;
        private String exerciseName;
        private String typeCode;
        private String typeName;
        private BigDecimal energyPerKgHr;
        private BigDecimal previewKcal;

        public static CatalogResp from(ExerciseCatalogEntity e,
                                       BigDecimal weightKg, Integer minutes) {
            BigDecimal preview = null;
            if (weightKg != null && minutes != null && minutes > 0) {
                preview = e.getEnergyPerKgHr()
                        .multiply(weightKg)
                        .multiply(BigDecimal.valueOf(minutes).divide(BigDecimal.valueOf(60), 4, RoundingMode.HALF_UP))
                        .setScale(0, RoundingMode.HALF_UP);
            }
            return CatalogResp.builder()
                    .exerciseNo(e.getExerciseNo())
                    .exerciseName(e.getExerciseName())
                    .typeCode(e.getType().getTypeCode())
                    .typeName(e.getType().getTypeName())
                    .energyPerKgHr(e.getEnergyPerKgHr())
                    .previewKcal(preview)
                    .build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WorkoutMemoReq {
        private Long empNo;
        private LocalDate date;
        private String dayMemo;
    }
}
