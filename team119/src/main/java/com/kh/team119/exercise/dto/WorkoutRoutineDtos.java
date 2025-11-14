package com.kh.team119.exercise.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class WorkoutRoutineDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ItemReq {
        private Long exerciseNo;
        private Integer minutes;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateReq {
        private Long empNo;
        private String routineName;
        private List<ItemReq> items;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Resp {
        private Long routineNo;
        private String routineName;
        private List<ItemResp> items;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ItemResp {
        private Long itemNo;
        private Long exerciseNo;
        private String exerciseName;
        private Integer minutes;
        private BigDecimal energyPerKgHr;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ApplyReq {
        private Long empNo;
        private Long routineNo;
        private LocalDate workDate;
        private Integer defaultMinutesOverride;
    }
}
