package com.kh.team119.club.category.dto;

import com.kh.team119.club.category.entity.ClubBoardCategoryEntity;
import lombok.Getter;

@Getter
public class ClubBoardCategoryReqDto {

    private String name;

    public ClubBoardCategoryEntity toEntity(){
        return ClubBoardCategoryEntity.builder()
                .name(this.name)
                .build();
    }
    @Getter
    public static class updateReqDto {
        private Long no;
        private String name;
        private String purpose;
        private Long eno;

    }

}
