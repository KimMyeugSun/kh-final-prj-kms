package com.kh.team119.challenge.repository;

import com.kh.team119.challenge.entity.ChallengeEntity;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import static com.kh.team119.challenge.entity.QChallengeEntity.challengeEntity;

@RequiredArgsConstructor
public class ChallengeRepositoryImpl implements ChallengeRepositoryCustom {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public ChallengeEntity findStatusIsActive() {
        return jpaQueryFactory
                .selectFrom(challengeEntity)
                .where(challengeEntity.status.eq("ACTIVE"))
                .fetchOne();
    }
}
