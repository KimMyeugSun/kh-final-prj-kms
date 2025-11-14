package com.kh.team119.healthBoard.repository;

import com.kh.team119.healthBoard.entity.HealthBoardEntity;
import com.kh.team119.tag.TagType;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface HealthBoardRepositoryCustom {
    Page<HealthBoardEntity> boardLookUp(Pageable pageable);

    List<HealthBoardEntity> findByQuery(String query);

    HealthBoardEntity findByIdWithTags(Long bno);

    List<HealthBoardEntity> findByTagIn(List<TagType> tags);
}
