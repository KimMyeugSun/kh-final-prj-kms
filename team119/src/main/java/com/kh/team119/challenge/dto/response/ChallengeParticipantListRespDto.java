package com.kh.team119.challenge.dto.response;

import com.kh.team119.challenge.entity.ChallengeParticipantEntity;
import lombok.AllArgsConstructor;
import lombok.Getter;

@Getter
@AllArgsConstructor
public class ChallengeParticipantListRespDto {
    private Long eno;
    private String empId;
    private String empName;

    public static ChallengeParticipantListRespDto from(ChallengeParticipantEntity entity) {
        var emp = entity.getEmployee();
        return new ChallengeParticipantListRespDto(
                emp != null ? emp.getEno()    : null,
                emp != null ? emp.getEmpId()  : null,
                emp != null ? emp.getEmpName(): null
        );
    }
}
