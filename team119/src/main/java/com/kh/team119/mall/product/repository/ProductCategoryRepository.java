package com.kh.team119.mall.product.repository;

import com.kh.team119.mall.product.entity.ProductCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductCategoryRepository extends JpaRepository<ProductCategoryEntity, Long> {
    
}
