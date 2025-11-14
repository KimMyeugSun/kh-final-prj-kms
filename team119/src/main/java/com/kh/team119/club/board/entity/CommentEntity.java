package com.kh.team119.club.board.entity;

import com.kh.team119.club.board.enums.Status;
import com.kh.team119.employee.entity.EmployeeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "CLUB_COMMENT")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CommentEntity {
    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bno", nullable = false)
    private BoardEntity board;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eno", nullable = false)
    private EmployeeEntity writer;

    @Column(nullable = false, length = 500)
    private String comment;

    @Enumerated(EnumType.STRING)
    @Column(length = 2)
    @Builder.Default
    private Status status = Status.NE;

    @OneToMany(mappedBy = "commentEntity", cascade = CascadeType.ALL , orphanRemoval = true)
    private List<LikeEntity> likeEntityList;

    @OneToMany(mappedBy = "commentEntity", cascade = CascadeType.ALL , orphanRemoval = true)
    private List<ReportEntity> reportEntityList;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
}
