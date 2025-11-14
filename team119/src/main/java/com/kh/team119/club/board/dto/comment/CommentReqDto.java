package com.kh.team119.club.board.dto.comment;

import com.kh.team119.club.board.entity.BoardEntity;
import com.kh.team119.club.board.entity.CommentEntity;
import com.kh.team119.club.board.entity.ReportEntity;
import com.kh.team119.club.board.enums.Type;
import com.kh.team119.employee.entity.EmployeeEntity;
import jakarta.validation.Valid;
import jakarta.validation.constraints.NotNull;
import lombok.Builder;
import lombok.Getter;

@Getter
public class CommentReqDto {

    @Getter
    public static class CommentSaveReqDto{

        private Long eno;
        private Long bno;
        private String comment;

        public CommentEntity toEntity(EmployeeEntity employeeEntity, BoardEntity boardEntity){
            return CommentEntity.builder()
                    .writer(employeeEntity)
                    .board(boardEntity)
                    .comment(this.comment)
                    .build();
        }
    }

    @Getter
    public static class reportReqDto{

        private Long eno;
        private String reportContent;

    }

}
