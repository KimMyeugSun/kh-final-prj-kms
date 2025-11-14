package com.kh.team119.authentication.dto;

import com.kh.team119.employee.dto.EmployeeDto;
import com.kh.team119.roletype.RoleType;
import com.kh.team119.tag.TagType;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RespPull {
    private String name;
    private EmployeeDto employee;

    @Builder
    public RespPull(String name, EmployeeDto employee) {
        this.name = name;
        this.employee = employee;
    }
}
