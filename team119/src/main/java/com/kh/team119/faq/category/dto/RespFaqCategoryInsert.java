package com.kh.team119.faq.category.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RespFaqCategoryInsert {
    private Long faqCategoryNo;
    private String faqCategoryName;
}
