package com.kh.team119.challenge.dto.response;

import com.kh.team119.challenge.entity.ChallengeEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Getter
@Setter
public class ChallengeRespDto {
    private Long no;
    private String title;
    private String description;
    private LocalDate startDate;
    private LocalDate endDate;
    private String status;
    private String url;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    // chellenge participant status
    private String myStatus;

    public static ChallengeRespDto from(ChallengeEntity entity) {
        ChallengeRespDto respDto = new ChallengeRespDto();

        respDto.no = entity.getNo();
        respDto.title = entity.getTitle();
        respDto.description = entity.getDescription();
        respDto.startDate = entity.getStartDate();
        respDto.endDate = entity.getEndDate();
        respDto.status = entity.getStatus();
        respDto.url = entity.getUrl();
        respDto.createdAt = entity.getCreatedAt();
        respDto.updatedAt = entity.getUpdatedAt();
        respDto.deletedAt = entity.getDeletedAt();

        return respDto;
    }
}
