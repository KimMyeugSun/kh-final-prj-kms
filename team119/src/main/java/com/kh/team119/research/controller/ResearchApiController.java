package com.kh.team119.research.controller;

import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.research.dto.ResearchReqDto;
import com.kh.team119.research.dto.ResearchRespDto;
import com.kh.team119.research.service.ResearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping(path = {"management/api/research", "api/research"})
public class ResearchApiController {

    private final ResearchService researchService;

    @GetMapping
    public ApiResponse<ResearchRespDto.LookUpRespDto> researchLookUp(@RequestParam String category){
        ResearchRespDto.LookUpRespDto list = researchService.researchLookUp(category);
        return ResponseFactory.success(list);
    }

    @GetMapping("{no}")
    public ApiResponse<ResearchRespDto.LookAtRespDto> researchLookAt(@PathVariable Long no){
        ResearchRespDto.LookAtRespDto data = researchService.researchLookAt(no);
        return ResponseFactory.success(data);
    }

    @PostMapping("{no}/submit")
    public ApiResponse<ResearchRespDto.SubmitRespDto> submit(
            @PathVariable Long no,
            @RequestBody ResearchReqDto.SubmitReqDto req
    ) {
        ResearchRespDto.SubmitRespDto data = researchService.submit(no, req);
        return ResponseFactory.success(data);
    }
}
