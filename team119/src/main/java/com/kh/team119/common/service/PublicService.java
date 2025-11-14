package com.kh.team119.common.service;

import com.kh.team119.department.dto.RespDepartmantList;
import com.kh.team119.department.repository.DepartmentRepository;
import com.kh.team119.employee.repository.EmployeeRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class PublicService {
    private final DepartmentRepository departmentRepository;

    public RespDepartmantList departmentLookUp() {
        return RespDepartmantList.builder()
                .departmentNames(
                        departmentRepository.findAll().stream()
                                .map(x -> x.getName().getDesc())
                                .toList()
                ).build();
    }

//    public List<String> roleLookUp() {
//        var result = roleTypeRepository.findAll();
//
//        return result.stream()
//                .map(x -> x.getRoleType().name())
//                .toList();
//    }
}
