package com.kh.team119.mall.product.repository;

import com.kh.team119.mall.product.entity.ProductEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.kh.team119.mall.product.entity.QProductEntity.productEntity;

@RequiredArgsConstructor
public class ProductRepositoryImpl implements ProductRepositoryCustom {
    private final JPAQueryFactory queryFactory;

    @Override
    public List<ProductEntity> findByCategory(String category) {
        return queryFactory
                .selectFrom(productEntity)
                .where(productEntity.category.name.eq(category))
                .fetch();
    }




}
