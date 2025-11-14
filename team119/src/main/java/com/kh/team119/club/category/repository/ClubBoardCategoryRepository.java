package com.kh.team119.club.category.repository;


import com.kh.team119.club.category.entity.ClubBoardCategoryEntity;
import com.kh.team119.club.category.enums.Allowed;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ClubBoardCategoryRepository extends JpaRepository<ClubBoardCategoryEntity, Long> , ClubBoardCategoryCustomRepository{

    List<ClubBoardCategoryEntity> findByAllowed(Allowed allowed);

     ClubBoardCategoryEntity findByName(String name);
}
