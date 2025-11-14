package com.kh.team119.club.board.repository.board;

import com.kh.team119.club.board.dto.board.BoardReqDto;
import com.kh.team119.club.board.entity.BoardEntity;
import com.kh.team119.club.board.enums.Status;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface BoardRepositoryCustom {
    Page<BoardEntity> lookUp(Pageable pageable, Long cno);

    List<BoardEntity> findByEntity(BoardReqDto.searchReqDto searchReqDto);

    List<BoardEntity> findByStatus(Status status);
}
