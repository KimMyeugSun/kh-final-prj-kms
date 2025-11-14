package com.kh.team119.club.board.dto.comment;

import com.kh.team119.club.board.dto.board.BoardRespDto;
import com.kh.team119.club.board.entity.BoardEntity;
import com.kh.team119.club.board.entity.CommentEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class CommentRespDto {

    @Getter
    @Builder
    public static class ListRespDto{
        private int totalPages;         //!< 전체 페이지 수
        private Long total;             //!< 전체 수
        private int currentPage;        //!< 현재 페이지
        private int pageSize;

        List<CommentRespDto.ListRespDto.ListInnerRespDto> data;

        @Getter
        public static class ListInnerRespDto{
            private Long no;
            private Long bno;
            private Long eno;
            private String comment;
            private String writerName;
            private LocalDateTime createdAt;
            private long likeCnt;
            private long reportCnt;

            public static CommentRespDto.ListRespDto.ListInnerRespDto from(CommentEntity entity){
                CommentRespDto.ListRespDto.ListInnerRespDto listInnerRespDto = new CommentRespDto.ListRespDto.ListInnerRespDto();
                listInnerRespDto.no = entity.getNo();
                listInnerRespDto.eno = entity.getWriter().getEno();
                listInnerRespDto.bno = entity.getBoard().getNo();
                listInnerRespDto.comment = entity.getComment();
                listInnerRespDto.writerName = entity.getWriter().getEmpName();
                listInnerRespDto.createdAt = entity.getCreatedAt();
                listInnerRespDto.likeCnt = entity.getLikeEntityList().size();
                listInnerRespDto.reportCnt = entity.getReportEntityList().size();
                return listInnerRespDto;
            }
        }
        public static CommentRespDto.ListRespDto from(List<CommentRespDto.ListRespDto.ListInnerRespDto> data){
            return CommentRespDto.ListRespDto.builder().data(data).build();
        }
    }
}
