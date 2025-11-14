package com.kh.team119.rank.repository;


import com.kh.team119.rank.entity.RankEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface RankRepository extends JpaRepository<RankEntity, Long>, RankRepositoryCustom {
    RankEntity findByEmployeeEno(Long eno);

//    List<RankEntity> findAllByOrderByScoreDesc();

    List<RankEntity> findAllByRankingPeriod_CnoOrderByScoreDesc(Long cno);

    @Query("SELECT r FROM RankEntity r JOIN FETCH r.employee e ORDER BY r.score DESC")
    List<RankEntity> findAllWithEmployeeOrderByScoreDesc();


}
