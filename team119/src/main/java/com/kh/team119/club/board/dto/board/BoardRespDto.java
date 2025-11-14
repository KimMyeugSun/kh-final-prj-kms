package com.kh.team119.club.board.dto.board;

import com.kh.team119.club.board.entity.BoardEntity;
import com.kh.team119.club.board.entity.LikeEntity;
import com.kh.team119.club.category.entity.ClubBoardCategoryEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class BoardRespDto {

    @Getter
    public static class SearchBoardDto{
        private Long no;
        private String title;
        private String writerName;

        public static SearchBoardDto from(BoardEntity entity){
           SearchBoardDto boardDto = new SearchBoardDto();
           boardDto.no = entity.getNo();
           boardDto.title = entity.getTitle();
           boardDto.writerName = entity.getWriter().getEmpName();
           return boardDto;
        }

    }

    @Getter
    @Builder
    public static class ListRespDto{

        private int totalPages;         //!< 전체 페이지 수
        private Long total;             //!< 전체 수
        private int currentPage;        //!< 현재 페이지
        private int pageSize;

        List<ListInnerRespDto> data;

        @Getter
        public static class ListInnerRespDto{
            private Long no;
            private String title;
            private String writerName;
            private LocalDateTime createAt;
            private int hit;

            public static ListInnerRespDto from(BoardEntity boardEntity){
                ListInnerRespDto listInnerRespDto = new ListInnerRespDto();
                listInnerRespDto.no = boardEntity.getNo();
                listInnerRespDto.title = boardEntity.getTitle();
                listInnerRespDto.writerName = boardEntity.getWriter().getEmpName();
                listInnerRespDto.createAt = boardEntity.getCreateAt();
                listInnerRespDto.hit = boardEntity.getHit();
                return listInnerRespDto;
            }
        }
        public static BoardRespDto.ListRespDto from(List<ListInnerRespDto> data){
            return BoardRespDto.ListRespDto.builder().data(data).build();
        }
    }

    @Getter
    public static class DetailRespDto{

        private Long no;
        private String title;
        private String content;
        private Long eno;
        private String writerName;
        private long likeCnt;
        private long reportCnt;
        private LocalDateTime createAt;
        private LocalDateTime updateAt;
        private boolean isLiked;

        public static DetailRespDto from(BoardEntity entity, boolean isLiked,long likeCnt, long reportCnt){
            DetailRespDto respDto = new DetailRespDto();
            respDto.no = entity.getNo();
            respDto.title = entity.getTitle();
            respDto.content = entity.getContent();
            respDto.eno = entity.getWriter().getEno();
            respDto.writerName = entity.getWriter().getEmpName();
            respDto.createAt = entity.getCreateAt();
            respDto.likeCnt = likeCnt;
            respDto.reportCnt = reportCnt;
            respDto.isLiked = isLiked;
            if (entity.getUpdateAt() == null){
                respDto.updateAt = entity.getCreateAt();
            }else {
                respDto.updateAt = entity.getUpdateAt();
            }
            return respDto;
        }
    }

    @Getter
    public static class DelectRespDto{
        private Long bno;
        private String msg;
        private Long cno;
        public static DelectRespDto from(BoardEntity entity, String msg){
            DelectRespDto delectRespDto = new DelectRespDto();
            delectRespDto.bno = entity.getNo();
            delectRespDto.msg = msg;
            delectRespDto.cno = entity.getCategory().getNo();
            return delectRespDto;
        }
    }

    @Getter
    public static class EditRespDto{

        private Long bno;
        private String msg;
        private Long cno;

        public static EditRespDto from(BoardEntity entity, String msg){
            EditRespDto editRespDto = new EditRespDto();
            editRespDto.bno = entity.getNo();
            editRespDto.msg = msg;
            editRespDto.cno = entity.getCategory().getNo();
            return editRespDto;
        }
    }
}
