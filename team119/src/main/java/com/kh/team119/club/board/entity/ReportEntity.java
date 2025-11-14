package com.kh.team119.club.board.entity;

import com.kh.team119.club.board.enums.Type;
import com.kh.team119.employee.entity.EmployeeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "REPORT")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class ReportEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long reportNo;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eno", nullable = false, foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_REPORT"))
    private EmployeeEntity employeeEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "bno", nullable = false, foreignKey = @ForeignKey(name = "FK_CLUB_BOARD_NO_TO_REPORT"))
    private BoardEntity boardEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cno", foreignKey = @ForeignKey(name = "FK_CLUB_COMMENT_NO_TO_REPORT"))
    private CommentEntity commentEntity;

    private String reportContent;

    @Builder.Default
    private LocalDateTime createAt = LocalDateTime.now();

    @Enumerated(EnumType.STRING)
    @Column(length = 1)
    private Type type;

}
