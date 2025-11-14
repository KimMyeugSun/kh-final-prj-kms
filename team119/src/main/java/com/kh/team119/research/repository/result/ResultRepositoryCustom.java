package com.kh.team119.research.repository.result;

public interface ResultRepositoryCustom {
    int findMaxAttemptNoByResearchNoAndEno(Long researchNo, Long eno);
}
