package com.kh.team119.employee.dto;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.roletype.RoleType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class EmployeeDto {
    private Long empNo;
    private String empPosition;
    private String empDepartment;
    private String empProfileName;
    private String empEmail;
    private String empPhone;
    private String empAddress;
    private String empAddressDetail;
    private Long empWelfarePoints;

    private List<RoleType> roles;
//    private List<String> tags;

    public static EmployeeDto from(EmployeeEntity result) {
        EmployeeDto dto = new EmployeeDto();
        dto.empNo = result.getEno();
        dto.empPosition = result.getEmpPosition().getDesc();
        dto.empDepartment = result.getDepartmentEntity().getName().getDesc();
        dto.empProfileName = result.getEmpProfileName();
//        dto.tags = result.getTags().stream().map(x->x.getTag().getDesc()).toList();
        dto.empWelfarePoints = result.getWelfarePoints();

        dto.empEmail = result.getEmpEmail();
        dto.empPhone = result.getEmpPhone();
        dto.empAddress = result.getEmpAddress();
        dto.empAddressDetail = result.getEmpAddressDetail();
        return dto;
    }
}