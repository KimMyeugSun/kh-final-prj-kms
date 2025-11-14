package com.kh.team119.noticeboard.repository;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.noticeboard.entity.NoticeBoardEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.List;

import static com.kh.team119.noticeboard.entity.QNoticeBoardEntity.noticeBoardEntity;

@RequiredArgsConstructor
public class NoticeBoardRepositoryImpl implements NoticeBoardRepositoryDSL {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Page<NoticeBoardEntity> findAllAndDeletedAtIsNull(Pageable pageable) {
        List<NoticeBoardEntity> content = jpaQueryFactory
                .selectFrom(noticeBoardEntity)
                .where(
                        noticeBoardEntity.deletedAt.isNull()
                )
                .orderBy(
                        noticeBoardEntity.createdAt.desc(),
                        noticeBoardEntity.noticeBoardNo.desc()
                )
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        long total = jpaQueryFactory
                .selectFrom(noticeBoardEntity)
                .where(noticeBoardEntity.deletedAt.isNull())
                .fetch()
                .size();

        return PageableExecutionUtils.getPage(content, pageable, () -> total);
    }

    @Override
    public NoticeBoardEntity findByNoticeBoardNo(Long no) {
        return jpaQueryFactory
                .selectFrom(noticeBoardEntity)
                .where(
                        noticeBoardEntity.noticeBoardNo.eq(no),
                        noticeBoardEntity.deletedAt.isNull()
                )
                .fetchOne();
    }

    @Override
    public List<NoticeBoardEntity> xLatest(int size) {
        return jpaQueryFactory
                .selectFrom(noticeBoardEntity)
                .where(
                        noticeBoardEntity.deletedAt.isNull()
                )
                .orderBy(
                        noticeBoardEntity.createdAt.desc(),
                        noticeBoardEntity.noticeBoardNo.desc()
                )
                .limit(size)
                .fetch();
    }
}
