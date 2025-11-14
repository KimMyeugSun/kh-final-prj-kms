package com.kh.team119.faq.controller;

import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.faq.dto.*;
import com.kh.team119.faq.service.FaqService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(path = {"/api/faq", "/management/api/faq"})
@RequiredArgsConstructor
public class FaqApiController {
    private final FaqService faqService;

    @PostMapping("/register")
    public ApiResponse<?> register(@RequestBody ReqFaqRegister dto) {

        System.out.println("dto = " + dto);

        faqService.register(dto);

        return ResponseFactory
                .success("success");
    }

    @GetMapping("/look-up")
    public ApiResponse<RespFaqLookUp> lookUp() {
        var result = faqService.findAll();

        return ResponseFactory
                .success(result);
    }

    @GetMapping("/look-at/{faqNo}")
    public ApiResponse<RespFaqLookAt> lookAt(@PathVariable Long faqNo) {
        var result = faqService.LookAt(faqNo);

        return ResponseFactory
                .success(result);
    }

    @PutMapping("/edit/{faqNo}")
    public ApiResponse<?> edit(@PathVariable Long faqNo, @RequestBody ReqFaqEdit dto) {
        faqService.edit(faqNo, dto);

        return ResponseFactory
                .success("수정 성공");
    }

    @DeleteMapping("/delete/{faqNo}")
    public ApiResponse<?> delete(@PathVariable Long faqNo) {
        faqService.softDelete(faqNo);
        return ResponseFactory
                .success("삭제 성공");
    }
}