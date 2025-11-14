package com.kh.team119.meal.dto;

import com.kh.team119.food.entity.FoodCatalogEntity;
import com.kh.team119.meal.entity.*;
import lombok.*;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.time.LocalDate;
import java.util.List;

public class MealDtos {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ItemReq {
        private Long foodNo;
        private BigDecimal servings;
        private String memo;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateReq {
        private Long employeeNo;
        private MealType mealType;
        private LocalDate eatDate;
        private String imageUrl;
        private String memo;
        private List<ItemReq> items;
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class ItemResp {
        private Long itemNo;
        private Long foodNo;
        private String foodName;
        private BigDecimal servings;
        private String servingDesc;

        public static ItemResp from(MealFoodItemEntity i) {
            FoodCatalogEntity f = i.getFood();

            BigDecimal servings = i.getServings() == null ? BigDecimal.ONE : i.getServings();
            String baseDesc = (f.getServingDesc() == null || f.getServingDesc().isBlank())
                    ? "" : f.getServingDesc().trim();

            String servingText;

            // g 단위 포함 (예: "1인분(200g)", "1마리(200g)")
            if (baseDesc.matches(".*\\d+\\s*g.*")) {
                try {
                    String gramStr = baseDesc.replaceAll(".*?(\\d+)\\s*g.*", "$1");
                    int grams = Integer.parseInt(gramStr);

                    BigDecimal gramVal = BigDecimal.valueOf(grams);
                    BigDecimal totalGrams = gramVal.multiply(servings);
                    int rounded = totalGrams.setScale(0, RoundingMode.HALF_UP).intValue();

                    // 괄호 안 g 숫자만 교체
                    if (baseDesc.contains("(")) {
                        servingText = baseDesc.replaceAll("\\(\\d+\\s*g\\)", "(" + rounded + "g)");
                    } else {
                        servingText = baseDesc + " (" + rounded + "g)";
                    }

                    // 인분 단위 처리
                    if (baseDesc.contains("인분")) {
                        servingText = servingText.replaceAll("1인분",
                                servings.stripTrailingZeros().toPlainString() + "인분");
                    }
                    // 마리 / 조각 / 컵 / 덩어리 등 일반 단위 처리
                    else if (baseDesc.matches("^1[가-힣]+\\(\\d+g\\)$")) {
                        servingText = baseDesc.replaceFirst("^1",
                                servings.stripTrailingZeros().toPlainString());
                        servingText = servingText.replaceAll("\\(\\d+\\s*g\\)", "(" + rounded + "g)");
                    }
                    else if (baseDesc.startsWith("1")) {
                        servingText = baseDesc.replaceFirst("^1",
                                servings.stripTrailingZeros().toPlainString());
                    }

                } catch (NumberFormatException e) {
                    servingText = servings.stripTrailingZeros().toPlainString() + " × " + baseDesc;
                }
            }
            // 인분 단독 처리 (예: "1인분")
            else if (baseDesc.contains("인분")) {
                servingText = baseDesc.replaceAll("1인분",
                        servings.stripTrailingZeros().toPlainString() + "인분");
            }
            // 기타 단위 ("1잔", "1조각", "1덩어리" 등)
            else if (baseDesc.startsWith("1")) {
                servingText = baseDesc.replaceFirst("^1",
                        servings.stripTrailingZeros().toPlainString());
            }
            // 그 외 단순 텍스트 (예: "사과", "김치" 등)
            else {
                servingText = servings.stripTrailingZeros().toPlainString() + " × " + baseDesc;
            }

            return ItemResp.builder()
                    .itemNo(i.getItemNo())
                    .foodNo(f.getFoodNo())
                    .foodName(f.getName())
                    .servings(servings)
                    .servingDesc(servingText)
                    .build();
        }

    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Resp {
        private Long mealNo;
        private Long employeeNo;
        private MealType mealType;
        private LocalDate eatDate;
        private BigDecimal totalKcal;
        private String imageUrl;
        private String memo;
        private List<ItemResp> items;

        public static Resp from(MealEntryEntity e) {
            return Resp.builder()
                    .mealNo(e.getMealNo())
                    .employeeNo(e.getEmployee().getEno())
                    .mealType(e.getMealType())
                    .eatDate(e.getEatDate())
                    .totalKcal(e.getTotalKcal())
                    .imageUrl(e.getImageUrl())
                    .memo(e.getMemo())
                    .items(e.getItems().stream().map(ItemResp::from).toList())
                    .build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateReq {
        private String imageUrl; // 업로드된 경로
        private String memo;
    }
}
