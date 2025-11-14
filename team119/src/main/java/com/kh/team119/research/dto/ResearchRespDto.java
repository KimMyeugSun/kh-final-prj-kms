package com.kh.team119.research.dto;

import com.kh.team119.research.entity.QuestionEntity;
import com.kh.team119.research.entity.QuestionOptionEntity;
import com.kh.team119.research.entity.ResearchEntity;
import jakarta.persistence.*;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;


@Getter
public class ResearchRespDto {


    @Getter
    @Builder
    public static class LookUpRespDto {

        private List<String> categoryList;
        private List<LookUpInnerRespDto> dataList;

        public static LookUpRespDto from(List<String> categoryList, List<LookUpInnerRespDto> dataList){
            return LookUpRespDto.builder()
                    .categoryList(categoryList)
                    .dataList(dataList)
                    .build();
        }


        @Getter
        @Builder
        public static class LookUpInnerRespDto {
            private Long no;
            private String title;
            private String required;

            public static LookUpInnerRespDto from(ResearchEntity entity){
                return LookUpInnerRespDto.builder()
                        .no(entity.getNo())
                        .title(entity.getTitle())
                        .required(entity.getRequired())
                        .build();
            }
        }
    }
    @Getter
    @Builder
    public static class LookAtRespDto{

        private Long no;
        private String title;
        private String topic;
        private String description;

        private List<QuestionRespDto> questionList;
        private List<OptionRespDto> optionList;

        @Getter
        @Builder
        public static class QuestionRespDto{
            private Long qno;
            private String question;
            private String required;

            public static QuestionRespDto fromQuestion(QuestionEntity questionEntity){
                return QuestionRespDto.builder()
                        .qno(questionEntity.getQno())
                        .question(questionEntity.getQuestion())
                        .required(questionEntity.getRequired())
                        .build();
            }
        }
        @Getter
        @Builder
        public static class OptionRespDto{
            private Long questionNo;
            private Long ono;
            private String option;
            private int value;

            public static OptionRespDto fromOption(QuestionOptionEntity option){
                return OptionRespDto.builder()
                        .ono(option.getOno())
                        .questionNo(option.getQuestion().getQno())
                        .option(option.getOption())
                        .value(option.getValue())
                        .build();
            }
        }
    }
    @Getter
    @Builder
    public static class SubmitRespDto {
        private Long resultNo;   // 저장된 결과 PK
        private int attemptNo;   // 시도번호 (현재 '리서치 기준' 증가)
        private int totalScore;  // 합계 점수
        private String summary;  // 결과 값(search topic에 따른 tagType의 Desc 값)
    }
}
