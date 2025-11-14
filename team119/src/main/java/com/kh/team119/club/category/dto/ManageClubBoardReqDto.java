package com.kh.team119.club.category.dto;

import lombok.Builder;
import lombok.Getter;

@Getter
public class ManageClubBoardReqDto {

    @Getter
    @Builder
    public static class ReqRejectOrApproveDto{
        private String action;
    }

}
