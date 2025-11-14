package com.kh.team119.challenge.entity;


import com.kh.team119.employee.entity.EmployeeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "CHALLENGE_PARTICIPANT", uniqueConstraints = @UniqueConstraint(name = "uq_challenge_participant_cno_eno", columnNames = {"cno","eno"}))
@Getter
@Setter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ChallengeParticipantEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cno", nullable = false, foreignKey = @ForeignKey(name = "FK_CHALLENGE_NO_TO_PARTICIPANT"))
    private ChallengeEntity challenge;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eno", nullable = false, foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_CHALLENGE_PARTICIPANT"))
    private EmployeeEntity employee;

    @Builder.Default
    private int totalScore = 0;

    @Builder.Default
    private int streakCount = 0;

    @Builder.Default
    private LocalDateTime joinedAt = LocalDateTime.now();

    @Builder.Default
    private String status = "ACTIVE";

    private LocalDateTime lastParticipantDate;

    @Builder.Default
    private int endRank = 0;



}
