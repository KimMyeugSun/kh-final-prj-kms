package com.kh.team119.noticeboard.dto;

import com.kh.team119.common.PageBase;
import com.kh.team119.noticeboard.entity.NoticeBoardEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@SuperBuilder
public class RespNoticeBoardList extends PageBase {
    private List<row> rows;

    @Getter
    @Setter
    @Builder
    public static class row {
        private Long no;
        private String title;
        private LocalDateTime createdAt;
        private Long viewCount;

        public static row from(NoticeBoardEntity entity) {
            return row.builder()
                    .no(entity.getNoticeBoardNo())
                    .title(entity.getTitle())
                    .createdAt(entity.getCreatedAt())
                    .viewCount(entity.getViewCount())
                    .build();
        }
    }

    public static RespNoticeBoardList from(Page<NoticeBoardEntity> page) {
        return RespNoticeBoardList.builder()
                .totalPages(page.getTotalPages())
                .total(page.getTotalElements())
                .currentPage(page.getNumber())
                .pageSize(page.getSize())
                .rows(page.getContent().stream().map(row::from).toList())
                .build();
    }

    public static RespNoticeBoardList from(List<NoticeBoardEntity> entities) {
        return RespNoticeBoardList.builder()
                .rows(entities.stream().map(row::from).toList())
                .build();
    }
}
