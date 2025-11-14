package com.kh.team119.club.board.controller;

import com.kh.team119.club.board.dto.board.BoardReqDto;
import com.kh.team119.club.board.dto.board.BoardRespDto;
import com.kh.team119.club.board.entity.BoardEntity;
import com.kh.team119.club.board.service.BoardService;
import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.common.exception.Team119Exception;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(path = {"management/api/club/board", "api/club/board"})
@RequiredArgsConstructor
public class BoardApiController {

    private final BoardService boardService;

    @GetMapping("/look-up/{cno}/{page}")
    public ResponseEntity<Object> boardLookup(@PathVariable int page, @PathVariable Long cno){
        // pathvariable responseParam으로 변경할 예정
        int pageLimit = 10;
        //!< PageRequest 0부터 시작 pathvariable 1부터 시작 -> page - 1
        var data = boardService.boardLookup(page - 1, pageLimit, cno);
        return ResponseEntity
                .ok(data);
    }

    @PostMapping("search")
    public ResponseEntity<List<BoardRespDto.SearchBoardDto>> searchBoard(@RequestBody BoardReqDto.searchReqDto reqDto){
        List<BoardRespDto.SearchBoardDto> data = boardService.searchBoard(reqDto);
        return ResponseEntity.ok(data);
    }

    @PostMapping
    public ResponseEntity<String> saveBoard(@RequestBody BoardReqDto.saveReqDto reqDto){
        boardService.saveBoard(reqDto);
        return ResponseEntity.ok("게시글이 저장되었습니다.");
    }

    @GetMapping("{no}/{eno}")
    public ResponseEntity<BoardRespDto.DetailRespDto> boardFindByNo(@PathVariable Long no, @PathVariable Long eno){
        BoardRespDto.DetailRespDto data = boardService.boardFindByNo(no, eno);
        return ResponseEntity.ok(data);
    }

    //게시글 좋아요 토글
    @PostMapping("like/{no}")
    public ResponseEntity<String> boardLikeToggle(@PathVariable Long no, @RequestBody Long eno){
        try {
            boardService.boardLikeToggle(no, eno);
        } catch (Team119Exception e) {
            //에러코드 수정 필요
            throw new RuntimeException(e);
        }
        return ResponseEntity.ok("like");
    }

    @PostMapping("report/{no}")
    public ApiResponse<Object> boardReport(@PathVariable Long no, @RequestBody BoardReqDto.reportReqDto reqDto){
        String str = boardService.boardReport(no, reqDto);
        return ResponseFactory.success(str, null);
    }

    @DeleteMapping("{no}")
    public ResponseEntity<BoardRespDto.DelectRespDto> boardUserDelect(@PathVariable Long no, @RequestBody BoardReqDto.BoardDelectReqDto delectReqDto){
        BoardEntity boardEntity = boardService.boardUserDelect(no, delectReqDto);
        return ResponseEntity.ok(BoardRespDto.DelectRespDto.from(boardEntity, "삭제가 완료되었습니다"));
    }

    @PutMapping("{no}")
    public ResponseEntity<BoardRespDto.EditRespDto> boardEdit(@PathVariable Long no, @RequestBody BoardReqDto.BoardEditReqDto reqDto){
        BoardEntity entity = boardService.boardEdit(no, reqDto);
        return ResponseEntity.ok(BoardRespDto.EditRespDto.from(entity, "수정이 완료되었습니다."));
    }
}
