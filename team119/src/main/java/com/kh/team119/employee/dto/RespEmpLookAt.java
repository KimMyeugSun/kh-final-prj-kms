package com.kh.team119.employee.dto;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.role.entity.RoleEntity;
import com.kh.team119.roletype.RoleType;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class RespEmpLookAt {
    private Long eno;
    private String empProfileName;
    private String empName;
    private String empPosition;
    private String empDepartment;
    private long welfarePoints;
    private List<RoleType> roles;
    private List<String> tag;

    public static RespEmpLookAt from(EmployeeEntity entity) {
        RespEmpLookAt dto = new RespEmpLookAt();
        dto.setEno(entity.getEno());
        dto.setEmpName(entity.getEmpName());
        dto.setEmpPosition(entity.getEmpPosition().getDesc());
        dto.setEmpDepartment(entity.getDepartmentEntity().getName().getDesc());
        dto.setWelfarePoints(entity.getWelfarePoints());
        dto.setRoles(entity.getRoles().stream().map(RoleEntity::getRoleType).toList());
        dto.setTag(entity.getTags() != null ? entity.getTags().stream().map(x->x.getTag().getDesc()).toList() : List.of());

        dto.setEmpProfileName(entity.getEmpProfileName());
        return dto;
    }
}
