package com.kh.team119.faq.category.dto;

import com.kh.team119.faq.category.entity.FaqCategoryEntity;
import com.kh.team119.faq.entity.FaqEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ReqFaqCategoryInsert {
    private String faqCategoryName;

    public FaqCategoryEntity toEntity() {
        return FaqCategoryEntity.builder()
                .faqCategoryName(faqCategoryName)
                .build();
    }
}
