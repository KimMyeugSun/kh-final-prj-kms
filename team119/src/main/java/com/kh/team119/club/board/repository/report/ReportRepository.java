package com.kh.team119.club.board.repository.report;

import com.kh.team119.club.board.entity.BoardEntity;
import com.kh.team119.club.board.entity.ReportEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ReportRepository extends JpaRepository<ReportEntity, Long>, ReportRepositoryCustom {

    long countByBoardEntity(BoardEntity entity);
}
