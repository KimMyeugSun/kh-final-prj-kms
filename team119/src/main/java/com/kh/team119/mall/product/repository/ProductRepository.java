package com.kh.team119.mall.product.repository;


import com.kh.team119.challenge.entity.ChallengeEntity;
import com.kh.team119.mall.product.entity.ProductEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;

public interface ProductRepository extends JpaRepository<ProductEntity, Long>, ProductRepositoryCustom {
    Page<ProductEntity> findAllByDeletedAtIsNull(Pageable pageable);

    Page<ProductEntity> findAllByDeletedAtIsNullAndNameContainingIgnoreCase(String keyword, Pageable pageable);

}
