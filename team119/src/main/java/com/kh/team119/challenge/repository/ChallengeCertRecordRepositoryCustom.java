package com.kh.team119.challenge.repository;

import com.kh.team119.challenge.entity.ChallengeCertRecordEntity;
import com.kh.team119.rank.dto.RankDto;

import java.util.List;

public interface ChallengeCertRecordRepositoryCustom {
    List<ChallengeCertRecordEntity> findMyCertRecords(Long cno, Long eno);

    List<RankDto> findScores();

}