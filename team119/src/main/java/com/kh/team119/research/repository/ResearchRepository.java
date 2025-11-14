package com.kh.team119.research.repository;

import com.kh.team119.research.entity.ResearchEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ResearchRepository extends JpaRepository<ResearchEntity, Long>, ResearchRepositoryCustom {
}
