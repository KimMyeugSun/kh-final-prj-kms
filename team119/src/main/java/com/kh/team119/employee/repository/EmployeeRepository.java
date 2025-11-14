package com.kh.team119.employee.repository;

import com.kh.team119.employee.entity.EmployeeEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.Optional;

public interface EmployeeRepository extends JpaRepository<EmployeeEntity, Long>, EmployeeRepositoryDSL {
    EmployeeEntity findByEmpId(String empId);
    boolean existsByEmpId(String id);

    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query("UPDATE EmployeeEntity e " +
            "SET e.welfarePoints = e.welfarePoints + :amount " +
            "WHERE e.eno <> 0 AND e.eno < 1000 " +
            "AND e.deletedAt IS NULL"
    )
    int bulkAddWelfarePoints(@Param("amount") Long amount);
}
