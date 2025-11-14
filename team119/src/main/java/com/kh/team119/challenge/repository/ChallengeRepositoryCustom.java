package com.kh.team119.challenge.repository;

import com.kh.team119.challenge.entity.ChallengeEntity;

public interface ChallengeRepositoryCustom {
    ChallengeEntity findStatusIsActive();
}
