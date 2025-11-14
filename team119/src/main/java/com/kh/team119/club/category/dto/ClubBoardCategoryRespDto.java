package com.kh.team119.club.category.dto;

import com.kh.team119.club.category.entity.ClubBoardCategoryEntity;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Builder
public class ClubBoardCategoryRespDto {

    @Getter
    public static class CreateSearchRespDto{
        private Long no;
        private String name;

        public static CreateSearchRespDto from(ClubBoardCategoryEntity categoryEntity){
          CreateSearchRespDto respDto = new CreateSearchRespDto();
          respDto.no = categoryEntity.getNo();
          respDto.name = categoryEntity.getName();
          return respDto;
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
        public static class ListInnerRespDto {
            private Long no;
            private String leaderName;
            private String name;
            private LocalDateTime updateAt;

            public static ListInnerRespDto from(ClubBoardCategoryEntity categoryEntity){
                ListInnerRespDto respDto = new ListInnerRespDto();
                respDto.no = categoryEntity.getNo();
                respDto.leaderName = categoryEntity.getLeader().getEmpName();
                respDto.name = categoryEntity.getName();
                respDto.updateAt = categoryEntity.getUpdateAt();
                return respDto;
            }
        }

        public static ListRespDto from(List<ListInnerRespDto> data){
            return ListRespDto.builder().data(data).build();
        }

    }
}
