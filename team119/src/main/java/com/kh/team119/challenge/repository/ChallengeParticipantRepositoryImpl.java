package com.kh.team119.challenge.repository;


import com.kh.team119.challenge.entity.ChallengeParticipantEntity;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.core.types.dsl.Expressions;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.List;

import static com.kh.team119.challenge.entity.QChallengeParticipantEntity.challengeParticipantEntity;
import static com.kh.team119.employee.entity.QEmployeeEntity.employeeEntity;


@RequiredArgsConstructor
public class ChallengeParticipantRepositoryImpl implements ChallengeParticipantCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<ChallengeParticipantEntity> findByNoAndKeyword(Long cno, String keyword, Pageable pageable) {

        BooleanExpression byCno = challengeParticipantEntity.challenge.no.eq(cno);
        BooleanExpression byKeyword = likeKeyword(keyword);
        BooleanExpression byStatus = challengeParticipantEntity.status.eq("ACTIVE");

        // content
        List<ChallengeParticipantEntity> content = queryFactory
                .selectFrom(challengeParticipantEntity)
                .join(challengeParticipantEntity.employee, employeeEntity).fetchJoin()
                .where(byCno, byKeyword, byStatus)
                .orderBy(challengeParticipantEntity.no.desc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        // count
        Long count = queryFactory
                .select(challengeParticipantEntity.count())
                .from(challengeParticipantEntity)
                .join(challengeParticipantEntity.employee, employeeEntity)
                .where(byCno, byKeyword, byStatus)
                .fetchOne();


        return PageableExecutionUtils.getPage(
                content,                            // SQL 결과
                pageable,                           // 페이징 조건
                () -> count != null ? count : 0L    // 전체 건수 -> getPage()가 LongSupplier 타입을 요구
        );
    }

    private BooleanExpression likeKeyword(String keyword) {
        if (keyword == null || keyword.isBlank()) return null;
        return employeeEntity.empId.containsIgnoreCase(keyword)
                .or(employeeEntity.empName.containsIgnoreCase(keyword))
                .or(Expressions.stringTemplate("CAST({0} AS string)", employeeEntity.eno)
                        .containsIgnoreCase(keyword));
    }

    @Override
    public String getStatusByCnoAndEno(Long cno, Long eno) {
        String status = queryFactory
                .select(challengeParticipantEntity.status)
                .from(challengeParticipantEntity)
                .where(
                        challengeParticipantEntity.challenge.no.eq(cno),
                        challengeParticipantEntity.employee.eno.eq(eno)
                )
                .fetchOne(); // 단일 값 조회

        return status;
    }
}
