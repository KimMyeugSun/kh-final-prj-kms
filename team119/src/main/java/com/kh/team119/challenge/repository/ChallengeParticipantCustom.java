package com.kh.team119.challenge.repository;

import com.kh.team119.challenge.entity.ChallengeParticipantEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface ChallengeParticipantCustom {
    Page<ChallengeParticipantEntity> findByNoAndKeyword(Long cno, String keyword, Pageable pageable);

    String getStatusByCnoAndEno(Long cno, Long eno);
}
