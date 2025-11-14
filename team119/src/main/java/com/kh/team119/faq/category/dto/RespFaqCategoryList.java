package com.kh.team119.faq.category.dto;

import com.kh.team119.faq.category.entity.FaqCategoryEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class RespFaqCategoryList {
    private List<category> categories;

    @Getter
    @Setter
    @Builder
    public static class category{
        private Long faqCategoryNo;
        private String faqCategoryName;

        public static category from(FaqCategoryEntity entity) {
            return category.builder()
                    .faqCategoryNo(entity.getFaqCategoryNo())
                    .faqCategoryName(entity.getFaqCategoryName())
                    .build();
        }
    }

    public static RespFaqCategoryList from(List<FaqCategoryEntity> entities ) {
        return RespFaqCategoryList.builder()
                .categories(entities.stream().map(category::from).toList())
                .build();
    }
}
