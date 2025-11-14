// src/main/java/com/kh/team119/food/dto/FoodDto.java
package com.kh.team119.food.dto;

import com.kh.team119.food.entity.FoodCatalogEntity;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import lombok.*;

import java.math.BigDecimal;

public class FoodDto {

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class CreateReq {
        @NotBlank
        @Size(max = 100)
        private String name;
        @Size(max = 100)
        private String servingDesc;
        private BigDecimal kcal;
        private BigDecimal protein;
        private BigDecimal calcium;
        private BigDecimal vitaminA;
        private BigDecimal vitaminB1;
        private BigDecimal vitaminB2;
        @Size(max = 300)
        private String memo;

        public FoodCatalogEntity toEntity() {
            return FoodCatalogEntity.builder()
                    .name(name)
                    .servingDesc(servingDesc)
                    .kcal(kcal)
                    .protein(protein)
                    .calcium(calcium)
                    .vitaminA(vitaminA)
                    .vitaminB1(vitaminB1)
                    .vitaminB2(vitaminB2)
                    .memo(memo)
                    .build();
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class UpdateReq {
        @NotBlank
        @Size(max = 100)
        private String name;
        @Size(max = 100)
        private String servingDesc;
        private BigDecimal kcal;
        private BigDecimal protein;
        private BigDecimal calcium;
        private BigDecimal vitaminA;
        private BigDecimal vitaminB1;
        private BigDecimal vitaminB2;
        @Size(max = 300)
        private String memo;

        public void apply(FoodCatalogEntity e) {
            e.setName(name);
            e.setServingDesc(servingDesc);
            e.setKcal(kcal);
            e.setProtein(protein);
            e.setCalcium(calcium);
            e.setVitaminA(vitaminA);
            e.setVitaminB1(vitaminB1);
            e.setVitaminB2(vitaminB2);
            e.setMemo(memo);
        }
    }

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class Resp {
        private Long foodNo;
        private String name;
        private String servingDesc;
        private BigDecimal kcal;
        private BigDecimal protein;
        private BigDecimal calcium;
        private BigDecimal vitaminA;
        private BigDecimal vitaminB1;
        private BigDecimal vitaminB2;
        private String memo;

        public static Resp from(FoodCatalogEntity e) {
            return Resp.builder()
                    .foodNo(e.getFoodNo())
                    .name(e.getName())
                    .servingDesc(e.getServingDesc())
                    .kcal(e.getKcal())
                    .protein(e.getProtein())
                    .calcium(e.getCalcium())
                    .vitaminA(e.getVitaminA())
                    .vitaminB1(e.getVitaminB1())
                    .vitaminB2(e.getVitaminB2())
                    .memo(e.getMemo())
                    .build();
        }
    }
}
