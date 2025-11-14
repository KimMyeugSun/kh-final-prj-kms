package com.kh.team119.noticeboard.entity;

import com.kh.team119.noticeboard.dto.ReqNoticeBoardEdit;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "NOTICE_BOARD")
@Getter
@Builder
@NoArgsConstructor(access = lombok.AccessLevel.PROTECTED)
@AllArgsConstructor(access = lombok.AccessLevel.PRIVATE)
public class NoticeBoardEntity {
    @Id
    @GeneratedValue(strategy = jakarta.persistence.GenerationType.IDENTITY)
    private Long noticeBoardNo;

    @Column(columnDefinition = "VARCHAR(128)", nullable = false)
    private String title;
    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Builder.Default
    @Column(columnDefinition = "BIGINT DEFAULT 0", nullable = false)
    private Long viewCount = 0L;

    @Builder.Default
    @Column(columnDefinition = "TIMESTAMP DEFAULT LOCALTIMESTAMP", nullable = false, updatable = false)
    private LocalDateTime createdAt = LocalDateTime.now();

    @Builder.Default
    @Column(columnDefinition = "TIMESTAMP DEFAULT NULL", insertable = false)
    private LocalDateTime updatedAt = null;

    @Builder.Default
    @Column(columnDefinition = "TIMESTAMP DEFAULT NULL", insertable = false)
    private LocalDateTime deletedAt = null;


    public void convertTemplateImgToRegularImg(Long eno, String origin, String templateStoragePath, String noticeBoardStoragePath) {

        String templateUrl = origin + "/" + String.format(templateStoragePath, eno);
        String regularUrl = origin + "/" + String.format(noticeBoardStoragePath, this.noticeBoardNo);


        this.content = this.content.replaceAll(templateUrl, regularUrl);
    }

    public void incViewCount() {
        ++this.viewCount;
    }

    public void edit(ReqNoticeBoardEdit dto) {
        this.title = dto.getTitle();
        this.content = dto.getContent();
        this.updatedAt = LocalDateTime.now();
    }

    public void softDelete() {
        this.deletedAt = LocalDateTime.now();
    }
}