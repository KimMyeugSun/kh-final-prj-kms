package com.kh.team119.challenge.dto.response;

import com.kh.team119.challenge.entity.ChallengeCertRecordEntity;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
public class ChallengeCertRecordRespDto {
    private Long no;
    private Long cpno;
    private String content;
    private String url;
    private String isApproved;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;


    public static ChallengeCertRecordRespDto from(ChallengeCertRecordEntity entity) {
        ChallengeCertRecordRespDto respDto = new ChallengeCertRecordRespDto();

        respDto.no = entity.getNo();
        respDto.cpno = entity.getChallengeParticipant().getNo();
        respDto.content = entity.getContent();
        respDto.url = entity.getUrl();;
        respDto.isApproved = entity.getIsApproved();
        respDto.createdAt = entity.getCreatedAt();
        respDto.updatedAt = entity.getUpdatedAt();
        respDto.deletedAt = entity.getDeletedAt();

        return respDto;
    }

}
