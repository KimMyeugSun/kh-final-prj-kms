package com.kh.team119.club.board.controller;

import com.kh.team119.club.board.dto.comment.CommentReqDto;
import com.kh.team119.club.board.service.CommentService;
import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("api/club/comment")
@RequiredArgsConstructor
public class CommentApiController {

    private final CommentService commentService;

    @GetMapping("{no}")
    public ResponseEntity<Object> commentLookUp(@PathVariable Long no,  @RequestParam(name = "page", defaultValue = "1") int cPage){
        int pageLimit = 5;
        //!< PageRequest 0부터 시작 pathvariable 1부터 시작 -> page - 1
        var data = commentService.commentLookUp(cPage - 1, pageLimit, no);
        return ResponseEntity
                .ok(data);
    }

    @PostMapping
    public ResponseEntity<String> commentSave(@RequestBody CommentReqDto.CommentSaveReqDto reqDto){
        if (reqDto.getComment() == null || reqDto.getComment().isEmpty()){
            // 에러코드 수정 필요
            throw new Team119Exception(ErrorCode.NOT_FOUND_CLUB_BOARD);
        }
        commentService.commentSave(reqDto);
        String data = "댓글을 등록했습니다";
        return ResponseEntity.ok(data);
    }
    @PostMapping("report/{no}")
    public ApiResponse<Void> boardReport(@PathVariable Long no, @RequestBody CommentReqDto.reportReqDto reqDto){
        try {
            commentService.commentReport(no, reqDto);
        }catch (Team119Exception e){
            return ResponseFactory.failure("신고 실패");
        }
        return ResponseFactory.success("신고가 접수되었습니다.");
    }
    @PostMapping("like/{no}")
    public ApiResponse<Void> boardLikeToggle(@PathVariable Long no, @RequestBody Long eno){
        try {
            commentService.commentLikeToggle(no, eno);
        } catch (Team119Exception e) {
            return ResponseFactory.failure("fail");
        }
        return ResponseFactory.success("like");
    }

}
