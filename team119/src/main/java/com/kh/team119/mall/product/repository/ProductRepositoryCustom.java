package com.kh.team119.mall.product.repository;

import com.kh.team119.mall.product.entity.ProductEntity;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface ProductRepositoryCustom {
    List<ProductEntity> findByCategory(String category);

    //List<ProductEntity> findAll(Pageable pageable);
}
