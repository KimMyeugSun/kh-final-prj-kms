package com.kh.team119.faq.category.controller;

import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.faq.category.dto.ReqFaqCategoryInsert;
import com.kh.team119.faq.category.dto.RespFaqCategoryInsert;
import com.kh.team119.faq.category.service.FaqCategoryService;
import lombok.*;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.Map;

@RestController
@RequestMapping(path = {"/api/faq-category", "/management/api/faq-category"})
@RequiredArgsConstructor
public class FaqCategoryApiController {
    private final FaqCategoryService faqCategoryService;

    @PostMapping("insert")
    public ApiResponse<RespFaqCategoryInsert> insert(@RequestBody ReqFaqCategoryInsert dto) {

        var result = faqCategoryService.insert(dto);

        return ResponseFactory
                .success(result);
    }
}
