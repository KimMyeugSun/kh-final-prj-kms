package com.kh.team119.club.board.repository.comment;

import com.kh.team119.club.board.entity.CommentEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CommentRepository extends JpaRepository<CommentEntity, Long>, CommentRepositoryCustom {
}
