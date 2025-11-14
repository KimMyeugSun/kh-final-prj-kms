package com.kh.team119.research.repository;

import com.kh.team119.research.entity.ResearchEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ResearchRepositoryCustom {
    List<ResearchEntity> LookUp(String category);
}
