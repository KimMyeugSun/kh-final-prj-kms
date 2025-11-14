package com.kh.team119.mall.order.repository;

import com.kh.team119.mall.order.entity.OrderEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface OrderRepositoryCustom {
    Page<OrderEntity> searchByKeyword(String keyword, Pageable pageable);
}
