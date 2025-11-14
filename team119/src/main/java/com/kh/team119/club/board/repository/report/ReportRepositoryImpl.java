package com.kh.team119.club.board.repository.report;

import com.kh.team119.club.board.entity.QReportEntity;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.kh.team119.club.board.entity.QLikeEntity.likeEntity;
import static com.kh.team119.club.board.entity.QReportEntity.reportEntity;


@RequiredArgsConstructor
public class ReportRepositoryImpl implements ReportRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public boolean existsByBnoAndEno(Long bno, Long eno) {
        BooleanExpression cond1 = reportEntity.employeeEntity.eno.eq(eno);
        BooleanExpression cond2 = reportEntity.boardEntity.no.eq(bno);
        Integer fetchOne = queryFactory.selectOne()
                .from(reportEntity)
                .where(cond1, cond2)
                .fetchOne();
        return fetchOne != null;
    }

    @Override
    public Long reportedCount(Long bno) {
        Long count = queryFactory.select(reportEntity.count())
                .from(reportEntity)
                .where(reportEntity.boardEntity.no.eq(bno))
                .fetchOne();
        return count == null ? 0 : count;
    }
}
