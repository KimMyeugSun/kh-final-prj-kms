package com.kh.team119.employee.repository;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.querydsl.core.Tuple;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.support.PageableExecutionUtils;

import java.util.List;

import static com.kh.team119.employee.entity.QEmployeeEntity.*;

@RequiredArgsConstructor
public class EmployeeRepositoryImpl implements EmployeeRepositoryDSL {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public Page<EmployeeEntity> lookUp(Pageable pageable) {
        List<EmployeeEntity> content = jpaQueryFactory
                .selectFrom(employeeEntity)
                .join(employeeEntity.departmentEntity).fetchJoin()
                .where(employeeEntity.eno.gt(0L))
                .orderBy(employeeEntity.eno.asc())
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        Long total = jpaQueryFactory
                .select(employeeEntity.count())
                .from(employeeEntity)
                .fetchOne();

        return PageableExecutionUtils.getPage(content, pageable, () -> total != null ? total : 0L);
    }

    @Override
    public EmployeeEntity findByEmpId(String empId) {
        return jpaQueryFactory
                .selectFrom(employeeEntity)
                .where(employeeEntity.empId.eq(empId))
                .fetchOne();
    }

    @Override
    public EmployeeEntity findByEno(Long eno) {
        return jpaQueryFactory
                .selectFrom(employeeEntity)
                .where(employeeEntity.eno.eq(eno))
                .fetchOne();
    }

    @Override
    public Long findWelfarePointByEno(Long empNo) {
        return jpaQueryFactory
                .select(employeeEntity.welfarePoints)
                .from(employeeEntity)
                .where(employeeEntity.eno.eq(empNo))
                .fetchOne();
    }

    @Override
    public List<Tuple> findTargetEno() {
        return jpaQueryFactory
                .select(employeeEntity.eno, employeeEntity.welfarePoints)
                .from(employeeEntity)
                .where(employeeEntity.eno.ne(0L), employeeEntity.eno.lt(1000L))
                .fetch();
    }
}
