package com.kh.team119.challenge.controller;


import com.kh.team119.challenge.dto.request.ChallengeCertRecordReqDto;
import com.kh.team119.challenge.dto.response.ChallengeCertRecordRespDto;
import com.kh.team119.challenge.service.ChallengeCertRecordService;
import com.kh.team119.common.FileController;
import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping({"management/api/challengeCertRecord", "api/challengeCertRecord"})
@RequiredArgsConstructor
public class ChallengeCertRecordApiController {
    private final ChallengeCertRecordService certRecordService;
    private final FileController fileCtrl;

    @Value("${CHALLENGE_CERT_STORAGE_PATH.IMG}") String challengeCertUploadPath;

    // insert (user)
    @PostMapping
    public ApiResponse<ChallengeCertRecordRespDto> save(
            ChallengeCertRecordReqDto challengeCertRecordReqDto,
            MultipartFile file
    ) {
        // 파일 처리
        if(file != null) {
            String img = fileCtrl.save(file, challengeCertUploadPath);
            challengeCertRecordReqDto.setUrl(img);
        }

        Long no = certRecordService.save(challengeCertRecordReqDto);
        ChallengeCertRecordRespDto respDto = certRecordService.findById(no);

        return ResponseFactory.success("CREATED", respDto);
    }



    // selectCert (user)
    @GetMapping("{cno}/participant/{eno}/cert-records")
    public ApiResponse<List<ChallengeCertRecordRespDto>> getMyCertRecords(
            @PathVariable Long cno,
            @PathVariable Long eno
    ) {
        return ResponseFactory.success(certRecordService.getMyCertRecords(cno, eno));
    }


    // selectOne
    @GetMapping("{no}")
    public ApiResponse<ChallengeCertRecordRespDto> findById(@PathVariable Long no) {
        ChallengeCertRecordRespDto respDto = certRecordService.findById(no);

        return ResponseFactory.success(respDto);
    }

    // delete (user)
    @DeleteMapping("{no}")
    public ApiResponse<Void> delete(@PathVariable Long no) {
        certRecordService.delete(no);

        return ResponseFactory.success("DELETED");
    }

    // update (user)
    @PutMapping("{no}")
    public ApiResponse<ChallengeCertRecordRespDto> updateById(
            ChallengeCertRecordReqDto reqDto,
            MultipartFile file,
            @PathVariable Long no
    ) {
        // 파일 처리
        if(file != null) {
            String img = fileCtrl.save(file, challengeCertUploadPath);
            reqDto.setUrl(img);
        } else {
            String currentUrl = certRecordService.findById(no).getUrl();
            reqDto.setUrl(currentUrl);
        }

        ChallengeCertRecordRespDto respDto = certRecordService.update(reqDto, no);

        return ResponseFactory.success("UPDATED", respDto);
    }


    // update cert IsApproved (admin)
    @PutMapping("/approve-cert/{no}")
    public ApiResponse<Void> updateIsApproved(@PathVariable Long no) {
        certRecordService.updateIsApproved(no);

        return ResponseFactory.success("UPDATED");
    }

}
