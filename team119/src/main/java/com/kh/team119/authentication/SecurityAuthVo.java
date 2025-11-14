package com.kh.team119.authentication;

import com.kh.team119.department.entity.DepartmentEntity;
import com.kh.team119.employee.EmpGradeType;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.role.entity.RoleEntity;
import com.kh.team119.roletype.RoleType;
import lombok.Getter;
import lombok.Setter;
import lombok.ToString;

import java.util.List;

@Getter
@Setter
@ToString
public class SecurityAuthVo {
    private String id;
    private String password;
    private String name;

    private String email;
    private String phone;
    private String address;
    private String addressDetail;

    private String position;
    private String department;
    private List<RoleType> roles;

    public static SecurityAuthVo from(EmployeeEntity entity) {
        SecurityAuthVo vo = new SecurityAuthVo();
        vo.setId(entity.getEmpId());
        vo.setPassword(entity.getEmpPwd());
        vo.setName(entity.getEmpName());
        vo.setEmail(entity.getEmpEmail());
        vo.setPhone(entity.getEmpPhone());
        vo.setAddress(entity.getEmpAddress());
        vo.setAddressDetail(entity.getEmpAddressDetail());
        vo.setPosition(entity.getEmpPosition().getDesc());
        vo.setDepartment(entity.getDepartmentEntity().getName().getDesc());
        vo.setRoles(entity.getRoles().stream().map(RoleEntity::getRoleType).toList());
        return vo;
    }

    public EmployeeEntity toEmpEntity(DepartmentEntity departmentEntity, String profileName) {
        return EmployeeEntity.builder()
                .empName(name)
                .empId(id)
                .empPwd(password)
                .empEmail(email)
                .empPhone(phone)
                .empAddress(address)
                .empAddressDetail(addressDetail)
                .empPosition(EmpGradeType.descOf(position))
                .departmentEntity(departmentEntity)
                .empProfileName(profileName)
                .build();
    }
}
