package com.kh.team119.welfarepointrecord.controller;

import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.welfarepointrecord.dto.RespWelfarePointRecord;
import com.kh.team119.welfarepointrecord.service.WelfarePointRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping(path={"/api/welfare-point-record", "/management/welfare-point-record"})
@RequiredArgsConstructor
public class WelfarePointRecordApiController {
    private final WelfarePointRecordService welfarePointRecordService;

    // user - 마이페이지 복지 포인트 이력 조회
    @GetMapping("/{eno}")
    public ApiResponse<RespWelfarePointRecord> getWelfarePointRecord(
            @PathVariable Long eno,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "no", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        var result = welfarePointRecordService.getWelfarePointRecord(eno, keyword, pageable);

        return ResponseFactory.success(result);
    }
}