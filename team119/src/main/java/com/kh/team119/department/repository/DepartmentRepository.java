package com.kh.team119.department.repository;

import com.kh.team119.department.DepartmentType;
import com.kh.team119.department.entity.DepartmentEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

public interface DepartmentRepository extends JpaRepository<DepartmentEntity, Long> {

    @Query("""
            SELECT d
            FROM DepartmentEntity d
            WHERE d.name = :etype
            """)
    DepartmentEntity findByName(DepartmentType etype);
}