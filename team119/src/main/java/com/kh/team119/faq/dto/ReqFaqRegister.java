package com.kh.team119.faq.dto;

import com.kh.team119.faq.category.entity.FaqCategoryEntity;
import com.kh.team119.faq.entity.FaqEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ReqFaqRegister {
    private Long faqCategoryNo;
    private String faqAsk;
    private String faqAnswer;

    public FaqEntity toEntity(FaqCategoryEntity faqCategoryEntity) {
        return FaqEntity.builder()
                .faqCategoryEntity(faqCategoryEntity)
                .faqAsk(faqAsk)
                .faqAnswer(faqAnswer)
                .build();
    }
}
