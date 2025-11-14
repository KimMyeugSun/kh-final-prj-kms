package com.kh.team119.faq.dto;

import com.kh.team119.faq.entity.FaqEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@Builder
@ToString
public class RespFaqLookUp {
    private List<Faq> faqs;

    @Getter
    @Setter
    @Builder
    @ToString
    public static class Faq {
        private Long faqNo;
        private String faqCategoryName;
        private String faqAsk;
        private String faqAnswer;
        public static Faq from(FaqEntity entity) {
            return Faq.builder()
                    .faqNo(entity.getFaqNo())
                    .faqCategoryName(entity.getFaqCategoryEntity().getFaqCategoryName())
                    .faqAsk(entity.getFaqAsk())
                    .faqAnswer(entity.getFaqAnswer())
                    .build();
        }
    }

    public static RespFaqLookUp from(List<FaqEntity> entities ) {
        return RespFaqLookUp.builder()
                .faqs(entities.stream().map(Faq::from).toList())
                .build();
    }
}
