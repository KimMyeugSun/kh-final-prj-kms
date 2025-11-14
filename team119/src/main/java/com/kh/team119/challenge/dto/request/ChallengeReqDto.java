package com.kh.team119.challenge.dto.request;

import com.kh.team119.challenge.entity.ChallengeEntity;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
public class ChallengeReqDto {
    private String title;
    private String description;
//    private int dailyPoint;
    private String status;
    private LocalDate startDate;
    private LocalDate endDate;
    private String url;

    public ChallengeEntity toEntity() {
        return ChallengeEntity.builder()
                .title(this.title)
                .description(this.description)
                //.dailyPoint(this.dailyPoint)
                .status(this.status)
                .startDate(this.startDate)
                .endDate(this.endDate)
                .url(this.url)
                .build();
    }
}
