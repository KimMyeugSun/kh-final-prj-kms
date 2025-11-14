package com.kh.team119.employee.repository;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.querydsl.core.Tuple;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface EmployeeRepositoryDSL {

    Page<EmployeeEntity> lookUp(Pageable pageable);
    EmployeeEntity findByEmpId(String empId);
    EmployeeEntity findByEno(Long eno);

    Long findWelfarePointByEno(Long empNo);

    List<Tuple> findTargetEno();
}
