package com.kh.team119.healthBoard.controller;

import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.healthBoard.dto.HealthBoardReqDto;
import com.kh.team119.healthBoard.dto.HealthBoardRespDto;
import com.kh.team119.healthBoard.service.HealthBoardService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = {"/management/api/health/board", "/api/health/board"})
@RequiredArgsConstructor
public class HealthBoardApiController {

    private final HealthBoardService boardService;

    @GetMapping("user/{bno}")
    public ApiResponse<HealthBoardRespDto.HealthBoardAdminDetailRespDto> userBoardLookAt(@PathVariable Long bno){
        HealthBoardRespDto.HealthBoardAdminDetailRespDto respDto = null;
        try {
            respDto = boardService.boardDetail(bno);
        }catch (Team119Exception e){
            // 에러코드 수정 필요 (해당 게시글 없음)
            throw new Team119Exception(ErrorCode.NOT_FOUND_CLUB_BOARD);
        }
        return ResponseFactory.success(respDto);
    }

    @GetMapping
    public ApiResponse<HealthBoardRespDto.HealthBoardListRespDto> boardLookUp(@RequestParam int page){
        int pageLimit = 10;
        HealthBoardRespDto.HealthBoardListRespDto listRespDto = boardService.boardLookup(page - 1, pageLimit);
        return ResponseFactory.success(listRespDto);
    }

    @GetMapping("{no}")
    public ApiResponse<HealthBoardRespDto.HealthBoardAdminDetailRespDto> boardDetail(@PathVariable Long no){
       HealthBoardRespDto.HealthBoardAdminDetailRespDto respDto = null;
       try {
            respDto = boardService.boardDetail(no);
       }catch (Team119Exception e){
           // 에러코드 수정 필요 (해당 게시글 없음)
           throw new Team119Exception(ErrorCode.NOT_FOUND_CLUB_BOARD);
       }
       return ResponseFactory.success(respDto);
    }

    @PostMapping("/insert")
    public ApiResponse<Void> healthBoardSave(@RequestBody HealthBoardReqDto.HealthBoardSaveReqDto reqDto){
        try {
            boardService.healthBoardSave(reqDto);
        }catch (Team119Exception e){
            return ResponseFactory.failure("게시글 저장 실패");
        }
        return ResponseFactory.success("게시글 저장 성공");
    }
    @PostMapping("/search")
    public ApiResponse<List<HealthBoardRespDto.HealthBoardSearchRespDto>> healthBoardSearch(@RequestBody HealthBoardReqDto.HealthBoardSearchReqDto reqDto){
        List<HealthBoardRespDto.HealthBoardSearchRespDto> data = null;
        try{
            data = boardService.healthBoardSearch(reqDto);
        }catch (Team119Exception e){
            // 에러코드 수정 필요(검색 내역 없음)
            throw new Team119Exception(ErrorCode.NOT_FOUND_CLUB_BOARD);
        }
        return ResponseFactory.success(data);
    }
    @PutMapping("{no}")
    public ApiResponse<Void> healthBoardEdit(@PathVariable Long no, @RequestBody HealthBoardReqDto.HealthBoardEditReqDto reqDto){
        try{
            boardService.healthBoardEdit(no, reqDto);
        }catch (Team119Exception e){
            return ResponseFactory.failure("수정실패");
        }
        return ResponseFactory.success("수정 성공");
    }

    @DeleteMapping("/{no}")
    public ApiResponse<Void> healthBoardDelete(@PathVariable Long no) {
        try {
            boardService.healthBoardDelete(no);
        } catch (Team119Exception e) {
            return ResponseFactory.failure("삭제 실패");
        }
        return ResponseFactory.success("삭제 성공");
    }

}
