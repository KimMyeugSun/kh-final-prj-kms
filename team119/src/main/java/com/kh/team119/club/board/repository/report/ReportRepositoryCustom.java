package com.kh.team119.club.board.repository.report;

public interface ReportRepositoryCustom {

    boolean existsByBnoAndEno(Long bno, Long eno);

    Long reportedCount(Long bno);
}
