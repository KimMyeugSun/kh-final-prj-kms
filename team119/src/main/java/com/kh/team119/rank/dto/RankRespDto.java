package com.kh.team119.rank.dto;


import com.kh.team119.challenge.dto.response.ChallengeRespDto;
import com.kh.team119.rank.entity.RankEntity;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class RankRespDto {
    private Long eno;
    private String empId;
    private String empName;
    private Long score;
    private String badge;
    private Long amount;
    private Integer rank;


}
