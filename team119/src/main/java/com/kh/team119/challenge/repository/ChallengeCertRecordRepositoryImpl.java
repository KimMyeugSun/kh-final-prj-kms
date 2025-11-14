package com.kh.team119.challenge.repository;

import com.kh.team119.challenge.entity.ChallengeCertRecordEntity;
import com.kh.team119.rank.dto.RankDto;
import com.querydsl.core.types.Projections;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Repository;

import java.util.List;

import static com.kh.team119.challenge.entity.QChallengeCertRecordEntity.challengeCertRecordEntity;
import static com.kh.team119.challenge.entity.QChallengeEntity.challengeEntity;
import static com.kh.team119.challenge.entity.QChallengeParticipantEntity.challengeParticipantEntity;


@Repository
@RequiredArgsConstructor
public class ChallengeCertRecordRepositoryImpl implements ChallengeCertRecordRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public List<ChallengeCertRecordEntity> findMyCertRecords(Long cno, Long eno) {

        return queryFactory
                .selectFrom(challengeCertRecordEntity)
                .join(challengeCertRecordEntity.challengeParticipant, challengeParticipantEntity).fetchJoin()
                .where(
                        challengeParticipantEntity.challenge.no.eq(cno),
                        challengeParticipantEntity.employee.eno.eq(eno),
                        challengeCertRecordEntity.deletedAt.isNull()
                )
                .orderBy(challengeCertRecordEntity.createdAt.desc())
                .fetch();
    }


    @Override
    public List<RankDto> findScores() {
        return queryFactory
                // 여러 필드를 select해서  Tuple로 반환되는데 RankDto 타입으로 받기 위해서 Projections 사용
                // Projections: QueryDSL에서 여러 컬럼을 DTO로 바로 매핑할 때 사용하는 헬퍼 클래스
                .select(Projections.constructor(
                        RankDto.class,
                        challengeParticipantEntity.employee.eno,
                        challengeCertRecordEntity.count().multiply(100) // 건수 * 100
                ))
                .from(challengeCertRecordEntity)
                .join(challengeCertRecordEntity.challengeParticipant, challengeParticipantEntity)
                .join(challengeParticipantEntity.challenge, challengeEntity)
                .where(challengeCertRecordEntity.isApproved.eq("Y"))
                .groupBy(challengeParticipantEntity.employee.eno)
                .orderBy(challengeCertRecordEntity.count().multiply(100).desc())
                .fetch()
                ;
    }
}
