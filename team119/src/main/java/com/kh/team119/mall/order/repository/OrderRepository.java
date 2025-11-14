package com.kh.team119.mall.order.repository;

import com.kh.team119.mall.order.entity.OrderEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface OrderRepository extends JpaRepository<OrderEntity, Long>, OrderRepositoryCustom {

    @Query("""
            SELECT DISTINCT o FROM OrderEntity o
            JOIN FETCH o.items i
            JOIN FETCH i.product p
            WHERE o.employee.eno = :eno
            ORDER BY o.createdAt DESC
            """)
    List<OrderEntity> findAllByEnoWithItems(Long eno);

    @Query("""
        SELECT DISTINCT o FROM OrderEntity o
        JOIN FETCH o.items i
        JOIN FETCH i.product p
        WHERE o.employee.eno = :eno
          AND o.no = :no
    """)
    OrderEntity findByEnoAndNo(Long eno, Long no);

}
