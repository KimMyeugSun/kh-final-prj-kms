package com.kh.team119.faq.category.Repository;

import com.kh.team119.faq.entity.FaqEntity;
import com.kh.team119.faq.repository.FaqRepositoryDSL;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

@RequiredArgsConstructor
public class FaqCategoryRepositoryImpl implements FaqCategoryRepositoryDSL {
    private final JPAQueryFactory jpaQueryFactory;
}
