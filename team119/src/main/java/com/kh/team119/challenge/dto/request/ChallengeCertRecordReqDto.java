package com.kh.team119.challenge.dto.request;

import com.kh.team119.challenge.entity.ChallengeCertRecordEntity;
import com.kh.team119.challenge.entity.ChallengeParticipantEntity;
import lombok.Getter;
import lombok.Setter;


@Getter
@Setter
public class ChallengeCertRecordReqDto {
    private Long cno;
    private Long eno;
    private String content;
    private String url;

    public ChallengeCertRecordEntity toEntity(ChallengeParticipantEntity participantEntity) {
        return ChallengeCertRecordEntity.builder()
                .challengeParticipant(participantEntity)
                .content(this.content)
                .url(this.url)
                .build();
    }






}



