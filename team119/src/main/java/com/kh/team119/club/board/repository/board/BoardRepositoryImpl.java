package com.kh.team119.club.board.repository.board;

import com.kh.team119.club.board.dto.board.BoardReqDto;
import com.kh.team119.club.board.entity.BoardEntity;
import com.kh.team119.club.board.enums.Status;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.List;

import static com.kh.team119.club.board.entity.QBoardEntity.boardEntity;

@RequiredArgsConstructor
public class BoardRepositoryImpl implements BoardRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<BoardEntity> lookUp(Pageable pageable, Long cno) {
        BooleanExpression cond1 = boardEntity.status.eq(Status.NE);
        BooleanExpression cond2 = boardEntity.category.no.eq(cno);
        List<BoardEntity> boardEntities = queryFactory.selectFrom(boardEntity)
                .leftJoin(boardEntity.writer).fetchJoin()
                .leftJoin(boardEntity.category).fetchJoin()
                .where(cond1, cond2)
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .orderBy(boardEntity.no.desc())
                .fetch();

        long total = queryFactory
                .selectFrom(boardEntity)
                .fetch()
                .size();
        return PageableExecutionUtils.getPage(boardEntities, pageable, () -> total);
    }

    @Override
    public List<BoardEntity> findByStatus(Status status) {
        return queryFactory.selectFrom(boardEntity)
                .leftJoin(boardEntity.category).fetchJoin()
                .leftJoin(boardEntity.writer).fetchJoin()
                .where(boardEntity.status.eq(Status.NE))
                .fetch();
    }

    @Override
    public List<BoardEntity> findByEntity(BoardReqDto.searchReqDto searchReqDto) {
        BooleanExpression cond1 = boardEntity.status.eq(Status.NE);
        BooleanExpression cond2 = boardEntity.category.no.eq(searchReqDto.getCno());
        BooleanExpression cond3 = titleOrWriterContains(searchReqDto.getQuery());
        return queryFactory.selectFrom(boardEntity)
                .leftJoin(boardEntity.category).fetchJoin()
                .leftJoin(boardEntity.writer).fetchJoin()
                .where(cond1, cond2, cond3)
                .fetch();
    }

    private BooleanExpression titleOrWriterContains(String query) {
        return boardEntity.writer.empName.contains(query).or(boardEntity.title.contains(query));
    }

}
