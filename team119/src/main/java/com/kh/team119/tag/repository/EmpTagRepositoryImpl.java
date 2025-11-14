package com.kh.team119.tag.repository;

import com.kh.team119.tag.TagType;
import com.kh.team119.tag.entity.EmpTagEntity;
import com.querydsl.core.types.dsl.BooleanExpression;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;

import java.util.List;

import static com.kh.team119.tag.entity.QEmpTagEntity.*;

@RequiredArgsConstructor
public class EmpTagRepositoryImpl implements EmpTagRepositoryDSL {
    private final JPAQueryFactory jpaQueryFactory;

    @Override
    public boolean existsByTagAndEno(TagType tag, Long eno) {
        Integer fetchOne = jpaQueryFactory
                .selectOne()
                .from(empTagEntity)
                .where(empTagEntity.tag.eq(tag), empTagEntity.employeeEntity.eno.eq(eno))
                .fetchFirst();
        return fetchOne != null;
    }

    @Override
    public void delete(TagType tag, Long eno) {
        jpaQueryFactory
                .delete(empTagEntity)
                .where(empTagEntity.tag.eq(tag), empTagEntity.employeeEntity.eno.eq(eno))
                .execute();
    }

    @Override
    public long deleteByEmployeeAndTopic(Long eno, String topic) {
        BooleanExpression cond1 = empTagEntity.employeeEntity.eno.eq(eno);
        BooleanExpression cond2 = empTagEntity.tag.stringValue().contains(topic);
        return jpaQueryFactory
                .delete(empTagEntity)
                .where(cond1, cond2)
                .execute();
    }

    @Override
    public List<EmpTagEntity> findByEno(Long eno) {
        return jpaQueryFactory
                .selectFrom(empTagEntity)
                .where(empTagEntity.employeeEntity.eno.eq(eno))
                .fetch();
    }
}
