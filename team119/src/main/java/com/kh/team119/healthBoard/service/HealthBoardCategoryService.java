package com.kh.team119.healthBoard.service;

import com.kh.team119.healthBoard.dto.HealthBoardRespDto;
import com.kh.team119.healthBoard.entity.CategoryEntity;
import com.kh.team119.healthBoard.repository.HealthBoardCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class HealthBoardCategoryService {

    private final HealthBoardCategoryRepository healthBoardCategoryRepository;
    public List<HealthBoardRespDto.HealthBoardCategoryRespDto> categoryLookUp() {
        List<CategoryEntity> categoryEntities = healthBoardCategoryRepository.findAll().stream().toList();
        return categoryEntities.stream().map(categoryEntity ->
                HealthBoardRespDto.HealthBoardCategoryRespDto.builder()
                        .cno(categoryEntity.getCno())
                        .name(categoryEntity.getName())
                        .build()).toList();
    }
}
