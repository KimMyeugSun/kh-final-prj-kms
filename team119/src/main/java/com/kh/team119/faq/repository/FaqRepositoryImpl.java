package com.kh.team119.faq.repository;

import com.kh.team119.faq.DelYn;
import com.kh.team119.faq.category.entity.QFaqCategoryEntity;
import com.kh.team119.faq.dto.ReqFaqEdit;
import com.kh.team119.faq.entity.FaqEntity;
import com.kh.team119.faq.entity.QFaqEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.kh.team119.faq.category.entity.QFaqCategoryEntity.faqCategoryEntity;
import static com.kh.team119.faq.entity.QFaqEntity.faqEntity;

@RequiredArgsConstructor
public class FaqRepositoryImpl implements FaqRepositoryDSL{
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<FaqEntity> findAllJoinFaqCategory() {
        return jpaQueryFactory
                .selectFrom(faqEntity)
                .join(faqEntity.faqCategoryEntity, faqCategoryEntity)
                .fetchJoin()
                .where(
                        faqEntity.delYn.eq(DelYn.N)
                )
                .fetch();
    }

    @Override
    public void updateEdit(Long faqNo, ReqFaqEdit dto) {
        jpaQueryFactory
                .update(faqEntity)
                .set(faqEntity.faqCategoryEntity.faqCategoryNo, dto.getFaqCategoryNo())
                .set(faqEntity.faqAsk, dto.getFaqAsk())
                .set(faqEntity.faqAnswer, dto.getFaqAnswer())
                .where(faqEntity.faqNo.eq(faqNo), faqEntity.delYn.eq(DelYn.N))
                .execute();
    }

    @Override
    public void softDelete(Long faqNo) {
        jpaQueryFactory
                .update(faqEntity)
                .set(faqEntity.delYn, DelYn.Y)
                .where(faqEntity.faqNo.eq(faqNo), faqEntity.delYn.eq(DelYn.N))
                .execute();
    }
}
