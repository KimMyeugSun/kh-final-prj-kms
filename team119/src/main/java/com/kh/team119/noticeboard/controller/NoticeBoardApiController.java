package com.kh.team119.noticeboard.controller;

import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.noticeboard.dto.ReqNoticeBoardEdit;
import com.kh.team119.noticeboard.dto.ReqNoticeBoardRegister;
import com.kh.team119.noticeboard.dto.RespNoticeBoardList;
import com.kh.team119.noticeboard.dto.RespNoticeBoardLookAt;
import com.kh.team119.noticeboard.service.NoticeBoardService;
import jakarta.servlet.http.HttpServletRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.data.web.PageableDefault;
import org.springframework.http.HttpRequest;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping(path = {"/management/api/noticeboard", "/api/noticeboard"})
@RequiredArgsConstructor
public class NoticeBoardApiController {
    private final NoticeBoardService noticeBoardService;

    @PostMapping("/register/{eno}")
    public ApiResponse<?> register(@PathVariable Long eno, @RequestBody ReqNoticeBoardRegister dto) {

        noticeBoardService.register(eno, dto);

        return ResponseFactory
                .success("등록 성공");
    }

    @GetMapping
    public ApiResponse<RespNoticeBoardList> getList(@PageableDefault Pageable pageable) {
        var result = noticeBoardService.findAll(pageable);

        return ResponseFactory
                .success(result);
    }

    @GetMapping("/x-latest")
    public ApiResponse<RespNoticeBoardList> getXLatest(@RequestParam int size) {
        var result = noticeBoardService.xLatest(size);

        return ResponseFactory
                .success(result);
    }

    @GetMapping("/look-at/{noticeBoardNo}")
    public ApiResponse<RespNoticeBoardLookAt> lookAt(@PathVariable Long noticeBoardNo, HttpServletRequest request) {
        boolean canIncViewCount = !request.getRequestURI().contains("/management/");
        var result = noticeBoardService.lookAt(noticeBoardNo, canIncViewCount);

        return ResponseFactory
                .success(result);
    }

    @PutMapping("edit/{noticeBoardNo}")
    public ApiResponse<?> edit(@PathVariable Long noticeBoardNo, @RequestBody ReqNoticeBoardEdit dto) {

        noticeBoardService.edit(noticeBoardNo, dto);

        return ResponseFactory
                .success("수정 성공");
    }

    @DeleteMapping("soft-delete/{noticeBoardNo}")
    public ApiResponse<?> softDelete(@PathVariable Long noticeBoardNo) {

        noticeBoardService.softDelete(noticeBoardNo);

        return ResponseFactory
                .success("삭제 성공");
    }}