package com.kh.team119.department.dto;

import com.kh.team119.department.DepartmentType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
@Builder
public class RespDepartmantList {
    private List<String> departmentNames;
}
