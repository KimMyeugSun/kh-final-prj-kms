package com.kh.team119.research.repository.option;

import com.kh.team119.research.entity.QuestionOptionEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.kh.team119.research.entity.QQuestionOptionEntity.questionOptionEntity;

@RequiredArgsConstructor
public class OptionRepositoryImpl implements OptionRepositoryCustom{

    private final JPAQueryFactory queryFactory;

    @Override
    public List<QuestionOptionEntity> findAllByQno(List<Long> qnoList) {
        return queryFactory.selectFrom(questionOptionEntity)
                .leftJoin(questionOptionEntity.question).fetchJoin()
                .where(questionOptionEntity.question.qno.in(qnoList))
                .fetch();
    }
}
