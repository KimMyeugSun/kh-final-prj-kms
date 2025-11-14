package com.kh.team119.research.repository.result;

import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.kh.team119.research.entity.QResultEntity.resultEntity;

@RequiredArgsConstructor
public class ResultRepositoryImpl implements ResultRepositoryCustom{
    private final JPAQueryFactory queryFactory;

    @Override
    public int findMaxAttemptNoByResearchNoAndEno(Long researchNo, Long eno) {
        BooleanExpression cond1 = resultEntity.research.no.eq(researchNo);
        BooleanExpression cond2 = resultEntity.employee.eno.eq(eno);
        Integer maxAttempt = queryFactory
                .select(resultEntity.attemptNo.max())
                .from(resultEntity)
                .where(cond1, cond2)
                .fetchOne();

        return maxAttempt != null ? maxAttempt : 0;
    }
}
