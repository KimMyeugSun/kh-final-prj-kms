package com.kh.team119.healthBoard.repository;

import com.kh.team119.healthBoard.entity.HealthBoardEntity;
import com.kh.team119.healthBoard.entity.QHealthBoardEntity;
import com.kh.team119.tag.TagType;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.time.LocalDate;
import java.util.List;

import static com.kh.team119.healthBoard.entity.QHealthBoardEntity.healthBoardEntity;

@RequiredArgsConstructor
public class HealthBoardRepositoryImpl implements HealthBoardRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<HealthBoardEntity> boardLookUp(Pageable pageable) {
        List<HealthBoardEntity> boardEntities = queryFactory.selectFrom(healthBoardEntity)
                .leftJoin(healthBoardEntity.category).fetchJoin()
                .leftJoin(healthBoardEntity.writer).fetchJoin()
                .where(healthBoardEntity.deletedAt.isNull())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(healthBoardEntity.bno.desc())
                .fetch();
        long total = queryFactory
                .selectFrom(healthBoardEntity)
                .fetch()
                .size();
        return PageableExecutionUtils.getPage(boardEntities, pageable, () -> total);
    }

    @Override
    public List<HealthBoardEntity> findByQuery(String query) {
        BooleanExpression cond1 = healthBoardEntity.title.contains(query);
        BooleanExpression cond2 = healthBoardEntity.deletedAt.isNull();
        return queryFactory.selectFrom(healthBoardEntity)
                .where(cond1,cond2)
                .fetch();
    }

//    @Override
//    public List<HealthBoardEntity> findByTagIn(List<TagType> tags) {
//        BooleanExpression cond1 = healthBoardEntity.exp.eq("Y");
//        BooleanExpression cond2 = healthBoardEntity.boardTags.any().in(tags);
//        return queryFactory.selectFrom(healthBoardEntity)
//                .where(cond1, cond2)
//                .fetch();
//    }

    /* jgj 수정 - 25.10.16
        loe : less or equal (<=) 작거나 같다 조건을 표현하는 QueryDSL 라이브러리에서 제공하는 비교 연산용 메서드
        goe : greater or equal (>=) 크거나 같다 조건을 표현하는 QueryDAL 전용 비교 메서드
    */
    @Override
    public List<HealthBoardEntity> findByTagIn(List<TagType> tags) {
        BooleanExpression cond1 = healthBoardEntity.exp.eq("Y");
        BooleanExpression cond2 = healthBoardEntity.boardTags.any().in(tags);
        BooleanExpression cond3 = healthBoardEntity.expFrom.loe(LocalDate.now());
        BooleanExpression cond4 = healthBoardEntity.expTo.goe(LocalDate.now());
        BooleanExpression cond5 = healthBoardEntity.deletedAt.isNull();
        return queryFactory.selectFrom(healthBoardEntity)
                .where(cond1, cond2, cond3, cond4, cond5)
                .fetch();
    }


    @Override
    public HealthBoardEntity findByIdWithTags(Long bno) {
        QHealthBoardEntity hb = healthBoardEntity;
        return queryFactory
                .select(hb)
                .from(hb)
                .leftJoin(hb.category).fetchJoin()
                .where(hb.bno.eq(bno))
                .distinct()
                .fetchOne();
    }
}
