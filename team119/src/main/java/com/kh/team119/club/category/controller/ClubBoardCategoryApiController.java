package com.kh.team119.club.category.controller;

import com.kh.team119.club.category.dto.ClubBoardCategoryReqDto;
import com.kh.team119.club.category.dto.ClubBoardCategoryRespDto;
import com.kh.team119.club.category.dto.ManageClubBoardReqDto;
import com.kh.team119.club.category.dto.ManageClubBoardRespDto;
import com.kh.team119.club.category.service.ClubBoardService;
import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = {"management/api/club/category", "api/club/category"})
@RequiredArgsConstructor
public class ClubBoardCategoryApiController {

    private final ClubBoardService clubBoardService;

    @GetMapping("{page}")
    public ResponseEntity<ClubBoardCategoryRespDto.ListRespDto> findByIsAllowed(@PathVariable int page){
        int pageLimit = 10;
        var data = clubBoardService.findByIsAllowed(page - 1, pageLimit);
        return ResponseEntity.ok(data);
    }

    @PostMapping("create/search")
    public ResponseEntity<List<ClubBoardCategoryRespDto.CreateSearchRespDto>> findByNameAndIsAllowed(@RequestBody ClubBoardCategoryReqDto reqDto){
        List<ClubBoardCategoryRespDto.CreateSearchRespDto> data = clubBoardService.findByNameAndIsAllowed(reqDto);
        return ResponseEntity.ok(data);
    }

    @PutMapping
    public ResponseEntity<String> updateCategory(@RequestBody ClubBoardCategoryReqDto.updateReqDto updateReqDto){
        clubBoardService.updateCategory(updateReqDto);
        return ResponseEntity.ok("동호회 창설 신청이 완료되었습니다.");
    }
    //관리자 페이지
    @GetMapping("req")
    public ApiResponse<Object> reqLookUp(@RequestParam int page){
        int pageLimit = 10;
        var data = clubBoardService.reqLookUp(page - 1, pageLimit);
        return ResponseFactory.success(data);
    }
    @GetMapping("req/{no}")
    public ApiResponse<ManageClubBoardRespDto.DetailRespDto> reqLookAt(@PathVariable Long no){
        ManageClubBoardRespDto.DetailRespDto data = clubBoardService.reqLookAt(no);
        return ResponseFactory.success(data);
    }
    //창설 반려, 승인
    @PutMapping("req/{no}")
    public ApiResponse<Void> reqRejectOrApprove(@PathVariable Long no, @RequestBody ManageClubBoardReqDto.ReqRejectOrApproveDto action){
        try {
            clubBoardService.reqRejectOrApprove(no, action);
        } catch (Team119Exception e) {
            // 에러코드 수정 필요
            throw new Team119Exception(ErrorCode.NOT_FOUND_CLUB_BOARD);
        }
        return ResponseFactory.success("success");
    }
}
