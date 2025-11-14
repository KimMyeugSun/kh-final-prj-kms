package com.kh.team119.mapinfo.repository.hospital;

import com.kh.team119.mapinfo.entity.hospital.HospitalEntity;
import com.kh.team119.mapinfo.entity.hospital.QHospitalEntity;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.core.types.dsl.NumberTemplate;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.kh.team119.mapinfo.entity.hospital.QHospitalEntity.hospitalEntity;

@RequiredArgsConstructor
public class HospitalRepositoryImpl implements HospitalRepositoryDSL {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public List<HospitalEntity> findHospitals(Double lon, Double lat, Double radiusKm, List<String> filters) {

        NumberTemplate<Double> distanceExpr = Expressions.numberTemplate(Double.class,
                "6371 * acos(cos(radians({0})) * cos(radians({1})) * cos(radians({2}) - radians({3})) + sin(radians({0})) * sin(radians({1})))",
                lat,
                hospitalEntity.wgs84lat,
                hospitalEntity.wgs84lon,
                lon);

        BooleanExpression dutyDivCond = (filters == null || filters.isEmpty())
                ? null
                : hospitalEntity.dutyDiv.in(filters);

        return jpaQueryFactory
                .selectFrom(hospitalEntity)
                .where(distanceExpr.loe(radiusKm), dutyDivCond)
                .fetch();
    }
}
