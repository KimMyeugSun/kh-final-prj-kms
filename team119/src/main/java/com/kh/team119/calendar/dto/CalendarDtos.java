// calendar/dto/CalendarDtos.java
package com.kh.team119.calendar.dto;

import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.util.List;

public class CalendarDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Event {
        private String id;
        private LocalDate date;
        private String type;          // "meal" | "workout"
        private String mealType;      // "BRE" | "LUN" | "DIN" (식사인 경우만)
        private String title;         // "123kcal"
        private BigDecimal kcal;
        private List<String> items;   // 음식명 목록
    }


    // 음식/식사
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MealSection {
        private String mealType;      // "아침"|"점심"|"저녁"
        private BigDecimal totalKcal; // 섹션 합계
        private List<MealItem> items;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MealItem {
        private String foodName;
        private java.math.BigDecimal servings;  // 몇 인분
        private String servingDesc;             // 1회 제공량 설명 (예: 200g)
        private java.math.BigDecimal kcal;      // 해당 항목 kcal (food.kcal * servings)
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class MealDetailResp {
        private LocalDate date;
        private BigDecimal dayTotal;          // 하루 총 kcal
        private List<MealSection> sections;   // 아침/점심/저녁
        private String memo;                  // 필요시
        private String imageUrl;              // 필요시
    }

    // 운동

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WorkoutDetail {
        private LocalDate date;          // 날짜
        private BigDecimal totalKcal;    // 총 소모 칼로리
        private String dayMemo;
        private List<WorkoutItem> items; // 개별 세션
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class WorkoutItem {
        private Long sessionNo;          // 삭제/메모 저장에 필요
        private String exerciseName;     // 운동명
        private Integer durationMin;     // 분
        private BigDecimal kcal;         // 소모 kcal
        private String memo;             // 개별 메모(있으면)
    }

}
