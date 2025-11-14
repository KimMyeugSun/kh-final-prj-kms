package com.kh.team119.club.board.repository.like;

import com.kh.team119.club.board.entity.LikeEntity;
import com.kh.team119.club.board.entity.QLikeEntity;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.kh.team119.club.board.entity.QLikeEntity.likeEntity;


@RequiredArgsConstructor
public class LikeRepositoryImpl implements LikeRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public boolean existsByEntity(LikeEntity entity) {
        BooleanExpression cond1 = likeEntity.boardEntity.eq(entity.getBoardEntity());
        BooleanExpression cond2 = likeEntity.employeeEntity.eq(entity.getEmployeeEntity());
        Integer fetchOne = queryFactory.selectOne()
                .from(likeEntity)
                .where(cond1, cond2)
                .fetchOne();
        return fetchOne != null;
    }


    @Override
    public void deleteByEntity(LikeEntity entity) {
        BooleanExpression cond1 = likeEntity.boardEntity.eq(entity.getBoardEntity());
        BooleanExpression cond2 = likeEntity.employeeEntity.eq(entity.getEmployeeEntity());
        queryFactory.delete(likeEntity).where(cond1, cond2).execute();
    }

    @Override
    public boolean existsByEnoAndBno(Long eno, Long bno) {
        BooleanExpression cond1 = likeEntity.employeeEntity.eno.eq(eno);
        BooleanExpression cond2 = likeEntity.boardEntity.no.eq(bno);
        Integer fetchOne = queryFactory.selectOne()
                .from(likeEntity)
                .where(cond1, cond2)
                .fetchOne();
        return fetchOne != null;
    }
}
