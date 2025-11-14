package com.kh.team119.faq.entity;

import com.kh.team119.faq.DelYn;
import com.kh.team119.faq.category.entity.FaqCategoryEntity;
import com.kh.team119.faq.dto.ReqFaqEdit;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table (name = "FAQ")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class FaqEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long faqNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "faq_category_no", foreignKey = @ForeignKey(name = "FK_FAQ_CATEGORY_NO_TO_FAQ"))
    private FaqCategoryEntity faqCategoryEntity;

    @Column(columnDefinition = "VARCHAR(256)", nullable = false)
    private String faqAsk;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String faqAnswer;

    @Builder.Default
    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "CHAR(1)", nullable = false)
    private DelYn delYn = DelYn.N;

    public void edit(ReqFaqEdit dto, FaqCategoryEntity faqCategoryEntity) {
        this.faqCategoryEntity = faqCategoryEntity;
        this.faqAsk = dto.getFaqAsk();
        this.faqAnswer = dto.getFaqAnswer();
    }
}
