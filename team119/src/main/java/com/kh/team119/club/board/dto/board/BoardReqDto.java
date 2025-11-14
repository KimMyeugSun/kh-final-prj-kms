package com.kh.team119.club.board.dto.board;

import com.kh.team119.club.board.entity.BoardEntity;
import com.kh.team119.club.board.entity.ReportEntity;
import com.kh.team119.club.board.enums.Type;
import com.kh.team119.club.category.entity.ClubBoardCategoryEntity;
import com.kh.team119.employee.entity.EmployeeEntity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;

@Getter
public class BoardReqDto {

    @Getter
    @Valid
    public static class searchReqDto{

        @NotNull
        private Long cno;
        @NotNull
        private String query;

        public BoardEntity toEntity(ClubBoardCategoryEntity categoryEntity){
            return BoardEntity.builder()
                    .category(categoryEntity)
                    .title(this.query)
                    .build();
        }
    }

    @Getter
    public static class saveReqDto{

        private Long cno;
        private Long eno;
        private String title;
        private String content;

        public BoardEntity toEntity(EmployeeEntity employeeEntity, ClubBoardCategoryEntity categoryEntity){
            return BoardEntity.builder()
                    .title(this.title)
                    .content(this.content)
                    .writer(employeeEntity)
                    .category(categoryEntity)
                    .build();
        }
    }

    @Getter
    @Valid
    public static class reportReqDto{

        @NotNull
        private Long eno;
        @NotNull
        private String reportContent;

        public ReportEntity toEntity(EmployeeEntity employeeEntity, BoardEntity boardEntity){
            return ReportEntity.builder()
                    .employeeEntity(employeeEntity)
                    .boardEntity(boardEntity)
                    .reportContent(this.reportContent)
                    .type(Type.B)
                    .build();
        }
    }

    @Getter
    @Valid
    public static class BoardDelectReqDto{
        @NotNull
        private Long eno;
    }

    @Getter
    @Valid
    public static class BoardEditReqDto{
        @NotNull
        private String content;
        @NotNull
        private Long eno;
    }
}
