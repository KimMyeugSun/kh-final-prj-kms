package com.kh.team119.exercise.repository;

import com.kh.team119.exercise.entity.ExerciseCatalogEntity;
import com.kh.team119.exercise.entity.QExerciseCatalogEntity;
import com.kh.team119.exercise.entity.QExerciseTypeEntity;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RequiredArgsConstructor
public class ExerciseCatalogRepositoryImpl implements ExerciseCatalogRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<ExerciseCatalogEntity> search(String typeCode, String q, Pageable pageable) {
        QExerciseCatalogEntity catalog = QExerciseCatalogEntity.exerciseCatalogEntity;
        QExerciseTypeEntity type = QExerciseTypeEntity.exerciseTypeEntity;

        BooleanBuilder where = new BooleanBuilder();

        if (typeCode != null && !typeCode.isBlank()) {
            where.and(type.typeCode.eq(typeCode));
        }
        if (q != null && !q.isBlank()) {
            where.and(
                    Expressions.stringTemplate(
                            "REPLACE(LOWER({0}), ' ', '')",
                            catalog.exerciseName
                    ).contains(q.toLowerCase().replaceAll(" ", ""))
            );
        }

        var query = queryFactory
                .selectFrom(catalog)
                .leftJoin(catalog.type, type).fetchJoin()
                .where(where) // 하나로 통일
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize());

        List<ExerciseCatalogEntity> content = query.fetch();

        Long totalL = queryFactory
                .select(catalog.count())
                .from(catalog)
                .leftJoin(catalog.type, type)
                .where(where) // 동일한 조건 사용
                .fetchOne();

        Long total = (totalL != null) ? totalL : 0L;

        return new PageImpl<>(content, pageable, total);
    }


}
