package com.kh.team119.club.category.entity;

import com.kh.team119.club.category.enums.Allowed;
import com.kh.team119.employee.entity.EmployeeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Entity
@Table(name = "CLUB_BOARD_CATEGORY")
@Getter
@AllArgsConstructor
@NoArgsConstructor
@Builder
public class ClubBoardCategoryEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eno", foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_CLUB_BOARD_CATEGORY"))
    private EmployeeEntity leader;

    @Column(nullable = false, length = 50)
    private String name;

    @Enumerated(EnumType.STRING)
    @Column(length = 1)
    @Builder.Default
    private Allowed allowed = Allowed.N;

    @Column(length = 1000)
    private String purpose;

    @Builder.Default
    private LocalDateTime createAt = LocalDateTime.now();
    private LocalDateTime updateAt;
    private LocalDateTime deleteAt;


    public void changePurpose(String purpose) { this.purpose = purpose; }
    public void assignLeader(EmployeeEntity leader) { this.leader = leader; }
    public void adminApprove() {
        this.allowed = Allowed.Y;
        this.updateAt = LocalDateTime.now();
    }
    public void userApproved() {this.allowed = Allowed.D;}
    public void reject() {
        this.leader = null;
        this.purpose = null;
        this.allowed = Allowed.N;
        this.updateAt = LocalDateTime.now();
    }
    public void updateDate(){this.updateAt = LocalDateTime.now();}

}
