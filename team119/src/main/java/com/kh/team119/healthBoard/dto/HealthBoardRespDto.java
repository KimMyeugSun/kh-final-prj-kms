package com.kh.team119.healthBoard.dto;

import com.kh.team119.healthBoard.entity.CategoryEntity;
import com.kh.team119.healthBoard.entity.HealthBoardEntity;
import com.kh.team119.healthBoard.entity.HealthBoardTag;
import com.kh.team119.tag.dto.RespTagLookUp;
import com.kh.team119.tag.entity.TagEntity;
import lombok.Builder;
import lombok.Getter;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Getter
public class HealthBoardRespDto {

    @Getter
    @Builder
    public static class HealthBoardListRespDto {

        private int totalPages;         //!< 전체 페이지 수
        private Long total;             //!< 전체 수
        private int currentPage;        //!< 현재 페이지
        private int pageSize;

        List<HealthBoardInnerRespDto> data;
        @Getter
        public static class HealthBoardInnerRespDto{
            private Long bno;
            private String categoryName;
            private String title;
            private LocalDateTime createdAt;

            public static HealthBoardInnerRespDto from(HealthBoardEntity boardEntity){
                HealthBoardInnerRespDto healthBoardInnerRespDto = new HealthBoardInnerRespDto();
                healthBoardInnerRespDto.bno = boardEntity.getBno();
                healthBoardInnerRespDto.categoryName = boardEntity.getCategory().getName();
                healthBoardInnerRespDto.title = boardEntity.getTitle();
                healthBoardInnerRespDto.createdAt = boardEntity.getCreatedAt();
                return healthBoardInnerRespDto;
            }
        }
    }
    @Getter
    @Builder
    public static class HealthBoardCategoryRespDto{
        private Long cno;
        private String name;
    }
    @Getter
    @Builder
    public static class HealthBoardSearchRespDto{

        private Long bno;
        private String title;

        public static HealthBoardSearchRespDto from(HealthBoardEntity entity){
            return HealthBoardSearchRespDto.builder()
                    .bno(entity.getBno())
                    .title(entity.getTitle())
                    .build();
        }
    }
    @Getter
    @Builder
    public static class HealthBoardAdminDetailRespDto {
        private Long bno;
        private Long cno;
        private String categoryName;
        private String title;
        private String content;
        private List<String> imgUrls;
        private boolean exp;
        private LocalDate expFrom;
        private LocalDate expTo;
        private List<String> tags;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public static HealthBoardAdminDetailRespDto from(
                HealthBoardEntity boardEntity,
                CategoryEntity categoryEntity,
                List<String> tags
        ) {
            boolean exp = "Y".equalsIgnoreCase(boardEntity.getExp());

            return HealthBoardAdminDetailRespDto.builder()
                    .bno(boardEntity.getBno())
                    .cno(categoryEntity.getCno())
                    .categoryName(categoryEntity.getName())
                    .title(boardEntity.getTitle())
                    .content(boardEntity.getContent())
                    .imgUrls(boardEntity.getImgUrl())
                    .exp(exp)
                    .expFrom(exp ? boardEntity.getExpFrom() : null)
                    .expTo(exp ? boardEntity.getExpTo() : null)
                    .tags(tags)
                    .createdAt(boardEntity.getCreatedAt())
                    .updatedAt(boardEntity.getUpdatedAt() != null ? boardEntity.getUpdatedAt() : boardEntity.getCreatedAt())
                    .build();
        }

    }



}
