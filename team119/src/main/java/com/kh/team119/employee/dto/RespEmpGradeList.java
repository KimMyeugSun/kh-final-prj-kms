package com.kh.team119.employee.dto;

import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class RespEmpGradeList {
    private List<String> empGradeNameList;
}