package com.kh.team119.club.board.repository.board;

import com.kh.team119.club.board.entity.BoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface BoardRepository extends JpaRepository<BoardEntity, Long>, BoardRepositoryCustom {
}
