package com.kh.team119.healthBoard.dto;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.healthBoard.entity.CategoryEntity;
import com.kh.team119.healthBoard.entity.HealthBoardEntity;
import com.kh.team119.tag.TagType;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Null;
import lombok.Getter;

import java.time.LocalDate;
import java.util.Date;
import java.util.List;

@Getter
public class HealthBoardReqDto {

    @Getter
    public static class HealthBoardSaveReqDto{
        private Long eno;
        private String title;
        private String content;
        private Long cno;
        private boolean exp;
        private List<String> imgUrl;
        private LocalDate expFrom;
        private LocalDate expTo;
        private List<String> tags;

        public HealthBoardEntity toHealthBoardEntity(EmployeeEntity employeeEntity, CategoryEntity categoryEntity, List<TagType> tags){
            String exp = "";
            if(this.exp){
                exp = "Y";
                return HealthBoardEntity.builder()
                        .writer(employeeEntity)
                        .title(this.title)
                        .content(this.content)
                        .category(categoryEntity)
                        .boardTags(tags)
                        .exp(exp)
                        .expTo(this.expTo)
                        .expFrom(this.expFrom)
                        .imgUrl(this.imgUrl)
                        .build();
            }else {
                exp = "N";
                return HealthBoardEntity.builder()
                        .writer(employeeEntity)
                        .title(this.title)
                        .content(this.content)
                        .category(categoryEntity)
                        .boardTags(tags)
                        .exp(exp)
                        .imgUrl(this.imgUrl)
                        .build();
            }

        }

    }
    @Valid
    @Getter
    public static class HealthBoardSearchReqDto {
        @NotNull
        private String query;

        public HealthBoardEntity toEntity(){
            return HealthBoardEntity.builder()
                    .title(this.query)
                    .build();
        }

    }
    @Getter
    public static class HealthBoardEditReqDto{
        private Long eno;
        private String title;
        private String content;
        private Long cno;
        private boolean exp;
        private List<String> imgUrl;
        private LocalDate expFrom;
        private LocalDate expTo;
        private List<String> tags;


    }
}
