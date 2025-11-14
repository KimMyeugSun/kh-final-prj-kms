package com.kh.team119.challenge.repository;


import com.kh.team119.challenge.entity.ChallengeParticipantEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ChallengeParticipantRepository extends JpaRepository<ChallengeParticipantEntity, Long>, ChallengeParticipantCustom {

    ChallengeParticipantEntity findByChallenge_NoAndEmployee_Eno(Long cno, Long eno);

}
