package com.kh.team119.mapinfo.repository.pharmacy;


import com.kh.team119.mapinfo.entity.pharmacy.PharmacyEntity;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.kh.team119.mapinfo.entity.pharmacy.QPharmacyEntity.pharmacyEntity;

@RequiredArgsConstructor
public class PharmacyRepositoryImpl implements PharmacyRepositoryDSL {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<PharmacyEntity> findPharmacies(Double lon, Double lat, Double radiusKm){
        NumberTemplate<Double> distanceExpr = Expressions.numberTemplate(Double.class,
                "6371 * acos(cos(radians({0})) * cos(radians({1})) * cos(radians({2}) - radians({3})) + sin(radians({0})) * sin(radians({1})))",
                lat,
                pharmacyEntity.wgs84lat,
                pharmacyEntity.wgs84lon,
                lon);

        return jpaQueryFactory
                .selectFrom(pharmacyEntity)
                .where(distanceExpr.loe(radiusKm))
                .fetch();
    }
}
