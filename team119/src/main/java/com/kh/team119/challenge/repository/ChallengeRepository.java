package com.kh.team119.challenge.repository;

import com.kh.team119.challenge.entity.ChallengeEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface ChallengeRepository extends JpaRepository<ChallengeEntity, Long>, ChallengeRepositoryCustom {

    Page<ChallengeEntity> findAllByDeletedAtIsNull(Pageable pageable);

    ChallengeEntity findByNoAndDeletedAtIsNull(Long no);

    ChallengeEntity findByStatus(String status);

}
