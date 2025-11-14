package com.kh.team119.faq.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class ReqFaqEdit {
    private Long faqNo;

    private Long faqCategoryNo;

    private String faqAsk;
    private String faqAnswer;
}
