package com.kh.team119.club.category.repository;

import com.kh.team119.club.category.entity.ClubBoardCategoryEntity;
import com.kh.team119.club.category.enums.Allowed;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.List;

import static com.kh.team119.club.category.entity.QClubBoardCategoryEntity.clubBoardCategoryEntity;

@RequiredArgsConstructor
public class ClubBoardCategoryRepositoryImpl implements ClubBoardCategoryCustomRepository{

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<ClubBoardCategoryEntity> findByIsAllowed(Pageable pageable){
        List<ClubBoardCategoryEntity> entityList = queryFactory.selectFrom(clubBoardCategoryEntity)
                .leftJoin(clubBoardCategoryEntity.leader).fetchJoin()
                .where(clubBoardCategoryEntity.allowed.eq(Allowed.Y))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(clubBoardCategoryEntity.no.desc())
                .fetch();
        long total = queryFactory.selectFrom(clubBoardCategoryEntity)
                .fetch()
                .size();
        return PageableExecutionUtils.getPage(entityList, pageable, () -> total);
    }

    @Override
    public List<ClubBoardCategoryEntity> findByNameAndAllowd(String name) {
        BooleanExpression cond1 = clubBoardCategoryEntity.name.contains(name);
        BooleanExpression cond2 = clubBoardCategoryEntity.allowed.eq(Allowed.N);
        return queryFactory.selectFrom(clubBoardCategoryEntity)
                .where(cond1, cond2)
                .fetch();
    }
    // 관리자 페이지
    @Override
    public Page<ClubBoardCategoryEntity> reqLookUp(Pageable pageable) {
        List<ClubBoardCategoryEntity> entityList = queryFactory.selectFrom(clubBoardCategoryEntity)
                .leftJoin(clubBoardCategoryEntity.leader).fetchJoin()
                .where(clubBoardCategoryEntity.allowed.eq(Allowed.D))
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(clubBoardCategoryEntity.no.desc())
                .fetch();
        long total = queryFactory.selectFrom(clubBoardCategoryEntity)
                .where(clubBoardCategoryEntity.allowed.eq(Allowed.D))
                .fetch()
                .size();
        return PageableExecutionUtils.getPage(entityList, pageable, () -> total);
    }
}
