package com.kh.team119.challenge.entity;


import com.kh.team119.challenge.dto.request.ChallengeReqDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Entity
@Table(name = "CHALLENGE")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ChallengeEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(length = 100, nullable = false)
    private String title;

    @Column(length = 500, nullable = false)
    private String description;

    @Column(nullable = false)
    private LocalDate startDate;

    @Column(nullable = false)
    private LocalDate endDate;

    @Builder.Default
    @Column(length = 30)
    private String status = "PLANNED";

    @Column(length = 1000)
    private String url;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    public void delete() {
        this.updatedAt = LocalDateTime.now();
        this.deletedAt = LocalDateTime.now();
    }

    public void update(ChallengeReqDto challengeReqDto) {
        this.title = challengeReqDto.getTitle();
        this.description = challengeReqDto.getDescription();
        this.status = challengeReqDto.getStatus();
        this.startDate = challengeReqDto.getStartDate();
        this.endDate = challengeReqDto.getEndDate();
        this.url = challengeReqDto.getUrl();
        this.updatedAt = LocalDateTime.now();
    }

}
