package com.kh.team119.research.repository.question;

import com.kh.team119.research.entity.QuestionEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.kh.team119.research.entity.QQuestionEntity.questionEntity;

@RequiredArgsConstructor
public class QuestionRepositoryImpl implements QuestionRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public List<QuestionEntity> findByResearch(Long no) {
        return queryFactory.selectFrom(questionEntity)
                .leftJoin(questionEntity.research).fetchJoin()
                .where(questionEntity.research.no.eq(no))
                .orderBy(questionEntity.qno.desc())
                .fetch();
    }
}
