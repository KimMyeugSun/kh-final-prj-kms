package com.kh.team119.club.category.repository;


import com.kh.team119.club.category.entity.ClubBoardCategoryEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ClubBoardCategoryCustomRepository {

    Page<ClubBoardCategoryEntity> findByIsAllowed(Pageable pageable);

    List<ClubBoardCategoryEntity> findByNameAndAllowd(String name);
    //관리자 페이지
    Page<ClubBoardCategoryEntity> reqLookUp(Pageable pageable);
}
