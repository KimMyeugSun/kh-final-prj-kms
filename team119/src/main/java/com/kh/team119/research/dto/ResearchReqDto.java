package com.kh.team119.research.dto;

import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
public class ResearchReqDto {

        @Getter
        @Builder
        public static class SubmitReqDto {
            private Long eno;
            private Long questionNo;
            private String topic;
            private int totalScore;
        }

}
