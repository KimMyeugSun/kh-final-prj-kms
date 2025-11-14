package com.kh.team119.food.repository;

import com.kh.team119.food.entity.FoodCatalogEntity;
import com.kh.team119.food.entity.QFoodCatalogEntity;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
@RequiredArgsConstructor
public class FoodCatalogRepositoryImpl implements FoodCatalogRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    private static final QFoodCatalogEntity food = QFoodCatalogEntity.foodCatalogEntity;

    @Override
    public Page<FoodCatalogEntity> search(String q, Pageable pageable) {
        // 목록
        List<FoodCatalogEntity> content = queryFactory
                .selectFrom(food)
                .where(nameContains(q))
                .orderBy(food.name.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // 전체 개수
        Long total = queryFactory
                .select(food.count())
                .from(food)
                .where(nameContains(q))
                .fetchOne();

        return new PageImpl<>(content, pageable, total == null ? 0 : total);
    }

    private BooleanExpression nameContains(String q) {
        return (q == null || q.isBlank()) ? null : food.name.containsIgnoreCase(q.trim());
    }
}
