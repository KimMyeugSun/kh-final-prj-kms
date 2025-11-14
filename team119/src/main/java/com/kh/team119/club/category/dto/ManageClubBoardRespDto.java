package com.kh.team119.club.category.dto;

import com.kh.team119.club.category.entity.ClubBoardCategoryEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
public class ManageClubBoardRespDto {

    @Getter
    @Builder
    public static class ListRespDto{

        private int totalPages;         //!< 전체 페이지 수
        private Long total;             //!< 전체 수
        private int currentPage;        //!< 현재 페이지
        private int pageSize;

        List<ManageClubBoardRespDto.ListRespDto.ListInnerRespDto> data;

        @Getter
        public static class ListInnerRespDto {
            private Long no;
            private String leaderName;
            private String name;
            private LocalDateTime updateAt;

            public static ManageClubBoardRespDto.ListRespDto.ListInnerRespDto from(ClubBoardCategoryEntity categoryEntity){
                ManageClubBoardRespDto.ListRespDto.ListInnerRespDto respDto = new ManageClubBoardRespDto.ListRespDto.ListInnerRespDto();
                respDto.no = categoryEntity.getNo();
                respDto.leaderName = categoryEntity.getLeader().getEmpName();
                respDto.name = categoryEntity.getName();
                respDto.updateAt = categoryEntity.getUpdateAt();
                return respDto;
            }
        }

        public static ManageClubBoardRespDto.ListRespDto from(List<ManageClubBoardRespDto.ListRespDto.ListInnerRespDto> data){
            return ManageClubBoardRespDto.ListRespDto.builder().data(data).build();
        }
    }
    @Getter
    @Builder
    public static class DetailRespDto{
        private Long no;
        private String name;
        private String purpose;
        private Long eno;
        private String leaderName;
        private LocalDateTime updatedAt;
    }
}
