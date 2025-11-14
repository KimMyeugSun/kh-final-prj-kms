package com.kh.team119.challenge.controller;


import com.kh.team119.challenge.dto.request.ChallengeReqDto;
import com.kh.team119.challenge.dto.response.ChallengeRespDto;
import com.kh.team119.challenge.service.ChallengeParticipantService;
import com.kh.team119.challenge.service.ChallengeService;
import com.kh.team119.common.FileController;
import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(path = {"management/api/challenge", "api/challenge"})
@RequiredArgsConstructor
public class ChallengeApiController {
    private final ChallengeService challengeService;
    private final ChallengeParticipantService challengeParticipantService;
    private final FileController fileCtrl;

    @Value("${CHALLENGE_STORAGE_PATH.IMG}") String challengeUploadPath;

    // insert (admin)
    @PostMapping
    public ApiResponse<Void> insert(
            ChallengeReqDto challengeReqDto,
            MultipartFile file
    ) {

        if(file != null) {
            String img = fileCtrl.save(file, challengeUploadPath);
            challengeReqDto.setUrl(img);
        }

        challengeService.save(challengeReqDto);

        return ResponseFactory.success("CREATED");
    }

    // selectOne (admin&user)
    @GetMapping("{no}/{eno}")
    public ApiResponse<ChallengeRespDto> findById(@PathVariable Long no, @PathVariable Long eno) {
        ChallengeRespDto respDto = challengeService.findById(no);
        String status = challengeParticipantService.getStatusByCnoAndEno(no, eno);
        respDto.setMyStatus(status);

        return ResponseFactory.success(respDto);
    }


    // selectAll (admin&user)
    @GetMapping
    public ApiResponse<List<ChallengeRespDto>> findAll(
            @PageableDefault(size = 10, sort = "no", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        return ResponseFactory.success(challengeService.findAll(pageable));
    }


    // delete (admin)
    @DeleteMapping("{no}")
    public ApiResponse<Void> deleteById(@PathVariable Long no) {

        challengeService.delete(no);

        return ResponseFactory.success("DELETED");
    }


    // update (admin)
    @PutMapping("{no}")
    public ApiResponse<ChallengeRespDto> updateById(
            ChallengeReqDto challengeReqDto,
            MultipartFile file,
            @PathVariable Long no
    ) {
        if(file != null) {
            String img = fileCtrl.save(file, challengeUploadPath);
            challengeReqDto.setUrl(img);
        }  else {
            String currentUrl = challengeService.findById(no).getUrl();
            challengeReqDto.setUrl(currentUrl);
        }

        ChallengeRespDto respDto = challengeService.update(challengeReqDto, no);

        return ResponseFactory.success("UPDATED", respDto);
    }
}