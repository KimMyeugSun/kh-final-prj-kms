package com.kh.team119.challenge.repository;

import com.kh.team119.challenge.entity.ChallengeCertRecordEntity;
import com.kh.team119.rank.dto.RankDto;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ChallengeCertRecordRepository extends JpaRepository<ChallengeCertRecordEntity, Long>, ChallengeCertRecordRepositoryCustom {

    @Query("""
            SELECT new com.kh.team119.rank.dto.RankDto(
                p.employee.eno,
                COUNT(r) * 10
            )
            FROM ChallengeCertRecordEntity r
            JOIN r.challengeParticipant p
            WHERE p.challenge.no = :cno
              AND r.isApproved = 'Y'
            GROUP BY p.employee.eno
            """)
    List<RankDto> findScoresByCno(@Param("cno") Long cno);

}
