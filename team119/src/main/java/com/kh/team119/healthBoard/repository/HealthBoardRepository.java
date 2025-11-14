package com.kh.team119.healthBoard.repository;


import com.kh.team119.healthBoard.entity.HealthBoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;


public interface HealthBoardRepository extends JpaRepository<HealthBoardEntity, Long> , HealthBoardRepositoryCustom {

}
