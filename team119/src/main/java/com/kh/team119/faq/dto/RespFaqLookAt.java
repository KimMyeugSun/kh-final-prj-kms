package com.kh.team119.faq.dto;

import com.kh.team119.faq.entity.FaqEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class RespFaqLookAt {
    private Long faqNo;
    private String faqCategoryName;
    private Long faqCategoryNo;
    private String faqAsk;
    private String faqAnswer;


    public static RespFaqLookAt from(FaqEntity entity) {
        return RespFaqLookAt.builder()
                .faqNo(entity.getFaqNo())
                .faqCategoryName(entity.getFaqCategoryEntity().getFaqCategoryName())
                .faqCategoryNo(entity.getFaqCategoryEntity().getFaqCategoryNo())
                .faqAsk(entity.getFaqAsk())
                .faqAnswer(entity.getFaqAnswer())
                .build();
    }
}
