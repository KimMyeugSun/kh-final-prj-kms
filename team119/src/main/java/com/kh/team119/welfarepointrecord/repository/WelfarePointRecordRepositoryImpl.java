package com.kh.team119.welfarepointrecord.repository;

import com.kh.team119.welfarepointrecord.OccurrenceType;
import com.kh.team119.welfarepointrecord.entity.WelfarePointRecordEntity;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import static com.kh.team119.welfarepointrecord.entity.QWelfarePointRecordEntity.welfarePointRecordEntity;


@RequiredArgsConstructor
public class WelfarePointRecordRepositoryImpl implements WelfarePointRecordRepositoryDSL {

    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Page<WelfarePointRecordEntity> findByWprEmpNo(Long empNo, String keyword, Pageable pageable) {
        BooleanExpression cond = welfarePointRecordEntity.employeeEntity.eno.eq(empNo);

        if (keyword != null && !keyword.isBlank()) {
            String safe = keyword.replace("'", "''");

            String enumMatch = null;
            for (OccurrenceType type : OccurrenceType.values()) {
                if (type.getDesc().equals(keyword)) {
                    enumMatch = type.name();
                    break;
                }
            }

            BooleanExpression keywordCond =
                    Expressions.booleanTemplate("cast({0} as text) ILIKE '%" + safe + "%'",
                                    welfarePointRecordEntity.description)
                            .or(Expressions.booleanTemplate("cast({0} as text) ILIKE '%" + safe + "%'",
                                    welfarePointRecordEntity.no.stringValue()))
                            .or(Expressions.booleanTemplate("cast({0} as text) ILIKE '%" + safe + "%'",
                                    welfarePointRecordEntity.beforeValue.stringValue()))
                            .or(Expressions.booleanTemplate("cast({0} as text) ILIKE '%" + safe + "%'",
                                    welfarePointRecordEntity.afterValue.stringValue()))
                            .or(Expressions.booleanTemplate("cast({0} as text) ILIKE '%" + safe + "%'",
                                    welfarePointRecordEntity.amount.stringValue()))
                            .or(Expressions.booleanTemplate(
                                    "to_char({0}, 'YYYY-MM-DD') ILIKE '%" + safe + "%'",
                                    welfarePointRecordEntity.occurrenceAt));

            if (enumMatch != null) {
                keywordCond = keywordCond.or(
                        welfarePointRecordEntity.occurrenceType.stringValue().eq(enumMatch)
                );
            } else {
                keywordCond = keywordCond.or(
                        welfarePointRecordEntity.occurrenceType.stringValue().containsIgnoreCase(keyword)
                );
            }

            cond = cond.and(keywordCond);
        }

        var query = jpaQueryFactory
                .selectFrom(welfarePointRecordEntity)
                .where(cond)
                .orderBy(welfarePointRecordEntity.occurrenceAt.desc());

        var total = query.fetchCount();
        var content = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return PageableExecutionUtils.getPage(content, pageable, () -> total);
    }
}
