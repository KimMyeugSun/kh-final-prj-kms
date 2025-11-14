package com.kh.team119.rank.controller;


import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.rank.dto.RankRespDto;
import com.kh.team119.rank.service.RankService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("api/ranking")
@RequiredArgsConstructor
public class RankApiController {

    private final RankService rankService;

    // selectAll
    @GetMapping
    public ApiResponse<List<RankRespDto>> findAll() {
        List<RankRespDto> respDtoList = rankService.findAll();

        return ResponseFactory.success(respDtoList);
    }



}
