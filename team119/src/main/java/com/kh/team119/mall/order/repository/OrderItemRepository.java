package com.kh.team119.mall.order.repository;

import com.kh.team119.mall.order.entity.OrderItemEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OrderItemRepository extends JpaRepository<OrderItemEntity, Long> {
}
