package com.kh.team119.club.board.repository.like;

import com.kh.team119.club.board.entity.LikeEntity;

public interface LikeRepositoryCustom {
    boolean existsByEntity(LikeEntity likeEntity);

    void deleteByEntity(LikeEntity likeEntity);

    boolean existsByEnoAndBno(Long eno, Long bno);
}
