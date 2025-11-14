package com.kh.team119.noticeboard.dto;

import com.kh.team119.noticeboard.entity.NoticeBoardEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class ReqNoticeBoardEdit {
    private String title;
    private String content;
    private Long eno;
    private List<String> templateFiles;

    public NoticeBoardEntity toEntity() {
        return NoticeBoardEntity.builder()
                .title(title)
                .content(content)
                .build();
    }
}
