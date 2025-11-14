package com.kh.team119.dailygoal.dto;

import com.kh.team119.dailygoal.entity.DailyGoalEntity;
import com.kh.team119.employee.entity.EmployeeEntity;
import lombok.*;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class DailyGoalDto {
    private Long goalId;
    private Long empNo;
    private LocalDate goalDate;
    private String itemType;   // WORKOUT / MEAL
    private String itemId;
    private String itemText;
    private boolean done;

    // DTO → Entity 변환
    public DailyGoalEntity toEntity(EmployeeEntity emp) {
        return DailyGoalEntity.builder()
                .goalId(goalId)
                .employee(emp)
                .goalDate(goalDate)
                .itemType(itemType)
                .itemId(itemId)
                .itemText(itemText)
                .doneYn(done ? "Y" : "N")
                .createdAt(java.time.LocalDateTime.now())
                .build();
    }

    // Entity → DTO
    public static DailyGoalDto fromEntity(DailyGoalEntity e) {
        return DailyGoalDto.builder()
                .goalId(e.getGoalId())
                .empNo(e.getEmployee().getEno())
                .goalDate(e.getGoalDate())
                .itemType(e.getItemType())
                .itemId(e.getItemId())
                .itemText(e.getItemText())
                .done("Y".equals(e.getDoneYn()))
                .build();
    }
}