package com.kh.team119.employee.dto;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.entity.QEmployeeEntity;
import com.kh.team119.roletype.RoleType;
import com.querydsl.core.Tuple;
import lombok.*;

import java.util.List;

import static com.kh.team119.employee.entity.QEmployeeEntity.employeeEntity;

@Getter
@Setter
@Builder
public class RespEmpList {
    private int totalPages;         //!< 전체 페이지 수
    private Long total;             //!< 전체 수
    private int currentPage;        //!< 현재 페이지
    private int pageSize;           //!< 한 페이지에 보여줄 데이터 수

    private List<EmpVo> data;

    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    public static class EmpVo {
        private Long eno;
        private String name;
        private String department;
        private String position;
        private String phone;
        private String address;
        private Long welfarePoints;

//        private List<String> roles;
//        private List<String> tags;

        public static EmpVo from(EmployeeEntity entity){
            EmpVo emp = new EmpVo();
            emp.eno = entity.getEno();
            emp.name = entity.getEmpName();
            emp.department = entity.getDepartmentEntity().getName().getDesc();
            emp.position = entity.getEmpPosition().toString();
            emp.phone = entity.getEmpPhone();
            emp.address = entity.getEmpAddress()+ " " + entity.getEmpAddressDetail();
            emp.welfarePoints = entity.getWelfarePoints();
//            emp.roles = entity.getRoles().stream().map(r -> r.getRoleType().toString()).toList();
//            emp.tags = entity.getTags().stream().map(t -> t.getTag().getDesc()).toList();
            return emp;
        }
    }

    public static RespEmpList from(List<EmpVo> data){
        return RespEmpList.builder()
                .data(data)
                .build();
    }
}
