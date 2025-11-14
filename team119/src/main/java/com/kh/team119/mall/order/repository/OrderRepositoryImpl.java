package com.kh.team119.mall.order.repository;

import com.kh.team119.employee.entity.QEmployeeEntity;
import com.kh.team119.mall.order.entity.OrderEntity;
import com.kh.team119.mall.order.entity.QOrderEntity;
import com.querydsl.core.BooleanBuilder;
import com.querydsl.jpa.impl.JPAQuery;
import com.querydsl.jpa.impl.JPAQueryFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;

import java.util.List;

@RequiredArgsConstructor
public class OrderRepositoryImpl implements OrderRepositoryCustom {

    private final JPAQueryFactory queryFactory;

    @Override
    public Page<OrderEntity> searchByKeyword(String keyword, Pageable pageable) {
        QOrderEntity order = QOrderEntity.orderEntity;
        QEmployeeEntity emp = QEmployeeEntity.employeeEntity;

        BooleanBuilder builder = new BooleanBuilder();
        builder.or(order.no.stringValue().containsIgnoreCase(keyword));
        builder.or(order.employee.eno.stringValue().containsIgnoreCase(keyword));
        builder.or(order.employee.empName.containsIgnoreCase(keyword));
        builder.or(order.createdAt.stringValue().containsIgnoreCase(keyword));

        JPAQuery<OrderEntity> query = queryFactory.selectFrom(order)
                .join(order.employee, emp).fetchJoin()
                .where(builder);

        long total = query.fetchCount();
        List<OrderEntity> result = query
                .offset(pageable.getOffset())
                .limit(pageable.getPageSize())
                .fetch();

        return new PageImpl<>(result, pageable, total);
    }
}
