package com.kh.team119.club.board.repository.like;

import com.kh.team119.club.board.entity.BoardEntity;
import com.kh.team119.club.board.entity.CommentEntity;
import com.kh.team119.club.board.entity.LikeEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface LikeRepository extends JpaRepository<LikeEntity, Long>, LikeRepositoryCustom {

    long countByBoardEntity(BoardEntity entity);

}
