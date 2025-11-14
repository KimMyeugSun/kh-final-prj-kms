package com.kh.team119.healthBoard.controller;

import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.healthBoard.dto.HealthBoardRespDto;
import com.kh.team119.healthBoard.service.HealthBoardCategoryService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = {"management/api/health/category", "api/health/category"})
@RequiredArgsConstructor
public class HealthBoardCategoryApiController {

    private final HealthBoardCategoryService categoryService;

    @GetMapping
    public ApiResponse<List<HealthBoardRespDto.HealthBoardCategoryRespDto>> categoryLookUp(){
        List<HealthBoardRespDto.HealthBoardCategoryRespDto> categoryLookUpList = categoryService.categoryLookUp();
        return ResponseFactory.success(categoryLookUpList);
    }
}
