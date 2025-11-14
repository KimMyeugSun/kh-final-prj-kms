package com.kh.team119.club.board.repository.comment;


import com.kh.team119.club.board.entity.CommentEntity;
import com.kh.team119.club.board.enums.Status;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.List;

import static com.kh.team119.club.board.entity.QCommentEntity.commentEntity;
import static com.kh.team119.club.board.entity.QBoardEntity.boardEntity;

@RequiredArgsConstructor
public class CommentRepositoryImpl implements CommentRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<CommentEntity> lookUp(Pageable pageable, Long no) {
        BooleanExpression cond1 = commentEntity.status.eq(Status.NE);
        BooleanExpression cond2 = commentEntity.board.no.eq(no);
        List<CommentEntity> commentEntities = queryFactory.selectFrom(commentEntity)
                .leftJoin(commentEntity.writer).fetchJoin()
                .leftJoin(commentEntity.board).fetchJoin()
                .where(cond1, cond2)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(commentEntity.no.desc())
                .fetch();

        long total = queryFactory
                .selectFrom(commentEntity)
                .fetch()
                .size();
        return PageableExecutionUtils.getPage(commentEntities, pageable, () -> total);
    }
}
