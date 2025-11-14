package com.kh.team119.club.board.repository.comment;

import com.kh.team119.club.board.entity.CommentEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface CommentRepositoryCustom {

    Page<CommentEntity> lookUp(Pageable pageable, Long no);
}
