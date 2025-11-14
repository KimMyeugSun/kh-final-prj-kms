package com.kh.team119.club.board.entity;

import com.kh.team119.club.board.dto.board.BoardReqDto;
import com.kh.team119.club.board.enums.Status;
import com.kh.team119.club.category.entity.ClubBoardCategoryEntity;
import com.kh.team119.employee.entity.EmployeeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "CLUB_BOARD")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class BoardEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cno", nullable = false, foreignKey = @ForeignKey(name = "FK_CLUB_BOARD_CATEGORY_NO"))
    private ClubBoardCategoryEntity category;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eno", nullable = false, foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_CLUB_BOARD"))
    private EmployeeEntity writer;

    @Column(nullable = false, length = 100)
    private String title;

    @Column(nullable = false, length = 3000)
    private String content;

    @Column(nullable = false)
    @Builder.Default
    private int hit = 0;

    @Enumerated(EnumType.STRING)
    @Column(length = 2)
    @Builder.Default
    private Status status = Status.NE;

    @OneToMany(mappedBy = "boardEntity" , cascade = CascadeType.ALL , orphanRemoval = true)
    private List<LikeEntity> likeEntityList;

    @OneToMany(mappedBy = "boardEntity" , cascade = CascadeType.ALL , orphanRemoval = true)
    private List<ReportEntity> reportEntityList;

    @Builder.Default
    private LocalDateTime createAt = LocalDateTime.now();
    private LocalDateTime updateAt;

    public void updateHit(){hit += 1;}
    public void boardUserDelect(){
        status = Status.WD;
    }
    public void boardEdit(BoardReqDto.BoardEditReqDto editReqDto){
        content = editReqDto.getContent();
        updateAt = LocalDateTime.now();
    }

}

