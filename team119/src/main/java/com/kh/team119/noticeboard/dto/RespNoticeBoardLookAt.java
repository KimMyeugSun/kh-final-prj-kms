package com.kh.team119.noticeboard.dto;

import com.kh.team119.noticeboard.entity.NoticeBoardEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class RespNoticeBoardLookAt {
    private Long noticeBoardNo;
    private String title;
    private String content;
    private Long viewCount;
    private LocalDateTime createdAt;

    public static RespNoticeBoardLookAt from(NoticeBoardEntity result) {
        return RespNoticeBoardLookAt.builder()
                .noticeBoardNo(result.getNoticeBoardNo())
                .title(result.getTitle())
                .content(result.getContent())
                .viewCount(result.getViewCount())
                .createdAt(result.getCreatedAt())
                .build();
    }
}
