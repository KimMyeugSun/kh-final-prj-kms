package com.kh.team119.welfarepointrecord.vo;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.welfarepointrecord.OccurrenceType;
import com.kh.team119.welfarepointrecord.entity.WelfarePointRecordEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
@Builder
public class RecordVo {
    private EmployeeEntity employeeEntity;
    private OccurrenceType occurrenceType;
    private Long amount;
    private Long after;
    private Long before;
    private String description;

    public WelfarePointRecordEntity toEntity() {
        return WelfarePointRecordEntity.builder()
                .employeeEntity(employeeEntity)
                .occurrenceType(occurrenceType)
                .amount(amount)
                .afterValue(after)
                .beforeValue(before)
                .description(description)
                .build();
    }
}
