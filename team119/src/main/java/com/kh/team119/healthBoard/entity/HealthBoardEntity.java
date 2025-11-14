package com.kh.team119.healthBoard.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.healthBoard.dto.HealthBoardReqDto;
import com.kh.team119.tag.TagType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;
import java.util.stream.Collectors;
import java.util.stream.Stream;

@Entity
@Getter
@Table(name = "HEALTH_BOARD")
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class HealthBoardEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long bno;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cno", nullable = false, foreignKey = @ForeignKey(name = "FK_CATEGORY_NO_TO_HEALTH_BOARD"))
    private CategoryEntity category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eno", nullable = false, foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_HEALTH_BOARD"))
    private EmployeeEntity writer;

    @Column(length = 500, nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT", nullable = false)
    private String content;

    @Column(length = 500)
    private List<String> imgUrl;

    @Builder.Default
    @Column(length = 1)
    private String exp = "N";

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expFrom;

    @JsonFormat(pattern = "yyyy-MM-dd")
    private LocalDate expTo;
    @ElementCollection(fetch = FetchType.LAZY)
    @Enumerated(EnumType.STRING)
    private List<TagType> boardTags;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    public void convertTemplateImgToRegularImg(Long eno, String origin, String templateStoragePath, String healthBoardUploadPath) {

        String templateUrl = origin + "/" + String.format(templateStoragePath, eno);
        String regularUrl = origin + "/" + String.format(healthBoardUploadPath, this.bno);

        this.content = this.content.replaceAll(templateUrl, regularUrl);
    }

    public void editBoard(HealthBoardReqDto.HealthBoardEditReqDto reqDto, CategoryEntity categoryEntity) {
        title = reqDto.getTitle();
        content = reqDto.getContent();
        category = categoryEntity;
        List<String> existing = Optional.ofNullable(this.imgUrl).orElseGet(ArrayList::new);
        List<String> incoming = Optional.ofNullable(reqDto.getImgUrl()).orElseGet(Collections::emptyList);

        this.imgUrl = Stream.concat(existing.stream(), incoming.stream())
                .filter(Objects::nonNull)
                .distinct()
                .collect(Collectors.toList());

//        this.imgUrl.forEach(x -> {
//            System.out.println("merge = " + x);
//        });

        // content에 포함되지 않은 이미지들을 먼저 수집한 뒤 한 번에 삭제(동시 수정 방지)
        if (this.imgUrl != null && !this.imgUrl.isEmpty()) {
            String contentSafe = content == null ? "" : content;
            List<String> toRemove = this.imgUrl.stream()
                    .filter(img -> img == null || !contentSafe.contains(img))
                    .collect(Collectors.toList());

//            toRemove.forEach(img -> System.out.println("del img = " + img));
            this.imgUrl.removeAll(toRemove);

            // 남아있는 이미지들 로그
//            this.imgUrl.forEach(img -> System.out.println("prev img = " + img));
        }
        
        if (reqDto.isExp()) {
            exp = "Y";
            expFrom = reqDto.getExpFrom();
            expTo = reqDto.getExpTo();
        } else {
            exp = "N";
            expTo = null;
            expFrom = null;
        }
        updatedAt = LocalDateTime.now();
    }

    public void deleteBoard() {
        updatedAt = LocalDateTime.now();
        deletedAt = LocalDateTime.now();
    }

    public void addTag(List<TagType> tags) {
        for (TagType t : tags) {
            boolean exists = boardTags.stream().anyMatch(tagType -> tagType.equals(t));
            if (exists) return;
            else boardTags.add(t);
        }
    }

    public void removeTag(List<TagType> tags) {
        for (TagType t : tags) {
            boardTags.removeIf(bt -> bt.equals(t));
        }
    }

}