package com.kh.team119.challenge.controller;

import com.kh.team119.challenge.dto.request.ChallengeParticipantReqDto;
import com.kh.team119.challenge.dto.response.ChallengeParticipantListRespDto;
import com.kh.team119.challenge.service.ChallengeParticipantService;
import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping(path = {"management/api/challengeParticipant", "api/challengeParticipant"})
@RequiredArgsConstructor
public class ChallengeParticipantApiController {

    private final ChallengeParticipantService challengeParticipantService;


    // insert challenge participant (user)
    @PostMapping
    public ApiResponse<Void> save(@RequestBody ChallengeParticipantReqDto reqDto) {
        challengeParticipantService.save(reqDto);

        return ResponseFactory.success("CREATED");
    }


    // selectAll - 챌린지 참가자 목록 조회 (admin)
    @GetMapping("/{cno}")
    public ApiResponse<Page<ChallengeParticipantListRespDto>> findByNo (
            @PathVariable Long cno,
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 5, sort = "no", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {

        return ResponseFactory.success(challengeParticipantService.findByNo(cno, keyword, pageable));
    }


    // update challenge participant status (user)
    @PutMapping("/cancel")
    public ApiResponse<Void> updateStatus(@RequestBody ChallengeParticipantReqDto reqDto) {
        challengeParticipantService.updateStatus(reqDto);

        return ResponseFactory.success("UPDATED");
    }
}
