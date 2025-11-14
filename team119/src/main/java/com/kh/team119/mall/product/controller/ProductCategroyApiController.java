package com.kh.team119.mall.product.controller;


import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.mall.product.dto.response.ProductCategoryRespDto;
import com.kh.team119.mall.product.service.ProduceCategroyService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping(path = {"management/api/productCategory", "api/productCategory"})
@RequiredArgsConstructor
public class ProductCategroyApiController {

    private final ProduceCategroyService produceCategroyService;

    // 카테고리 목록 조회
    @GetMapping
    public ApiResponse<List<ProductCategoryRespDto>> findAll() {
        return ResponseFactory.success(produceCategroyService.findAll());
    }

}
