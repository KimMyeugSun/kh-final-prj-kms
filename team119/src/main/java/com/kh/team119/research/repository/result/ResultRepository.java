package com.kh.team119.research.repository.result;

import com.kh.team119.research.entity.ResultEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResultRepository extends JpaRepository<ResultEntity, Long>, ResultRepositoryCustom {

}
