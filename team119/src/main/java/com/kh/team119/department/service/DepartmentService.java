package com.kh.team119.department.service;

import com.kh.team119.department.dto.RespDepartmantList;
import com.kh.team119.department.repository.DepartmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class DepartmentService {
    private final DepartmentRepository repository;

    public RespDepartmantList lookUp() {
        return RespDepartmantList.builder()
                .departmentNames(
                        repository.findAll().stream()
                                .map(x -> x.getName().getDesc())
                                .toList()
                ).build();
    }
}