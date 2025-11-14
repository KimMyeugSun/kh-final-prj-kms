package com.kh.team119.dailygoal.entity;

import com.kh.team119.dailygoal.dto.DailyGoalDto;
import com.kh.team119.employee.entity.EmployeeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;

import static jakarta.persistence.FetchType.LAZY;

@Entity
@Table(
        name = "DAILY_GOAL",
        uniqueConstraints = @UniqueConstraint(columnNames = {"EMPLOYEE_NO", "GOAL_DATE", "ITEM_ID"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyGoalEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "GOAL_ID")
    private Long goalId;

    @ManyToOne(fetch = LAZY /*, cascade = NONE */)
    @JoinColumn(name = "EMPLOYEE_NO", nullable = false,
            foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_DAILY_GOAL"))
    private EmployeeEntity employee;

    @Column(name = "GOAL_DATE", nullable = false)
    private LocalDate goalDate;

    @Column(name = "ITEM_TYPE", length = 20, nullable = false)
    private String itemType; // WORKOUT / MEAL

    @Column(name = "ITEM_ID", length = 50, nullable = false)
    private String itemId;

    @Column(name = "ITEM_TEXT", length = 200, nullable = false)
    private String itemText;

    @Builder.Default
    @Column(name = "DONE_YN", length = 1, nullable = false)
    private String doneYn = "N";

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;
}