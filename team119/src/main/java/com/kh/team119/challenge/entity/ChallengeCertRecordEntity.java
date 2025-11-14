package com.kh.team119.challenge.entity;


import com.kh.team119.challenge.dto.request.ChallengeCertRecordReqDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CHALLENGE_CERT_RECORD")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ChallengeCertRecordEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cpno", nullable = false, foreignKey = @ForeignKey(name = "FK_CHALLENGE_PARTICIPANT_NO_TO_CHALLENGE_CERT_RECORD"))
    private ChallengeParticipantEntity challengeParticipant;

    private String content;
    private String url;

    @Builder.Default
    private String isApproved = "N";

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    public void delete() {
        this.updatedAt = LocalDateTime.now();
        this.deletedAt = LocalDateTime.now();
    }

    public void update(ChallengeCertRecordReqDto reqDto) {
        this.content = reqDto.getContent();
        this.url = reqDto.getUrl();
    }

    public void updateIsApproved(String currentIsApproved) {
        if(currentIsApproved.equals("N")) {
            this.isApproved = "Y";
        } else {
            this.isApproved = "N";
        }
    }
}
