package com.kh.team119.mall.cart.repository;


import com.kh.team119.mall.cart.dto.response.CartItemRespDto;
import com.kh.team119.mall.cart.entity.CartEntity;
import com.kh.team119.mall.cart.entity.CartItemEntity;
import com.kh.team119.mall.product.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface CartItemRepository extends JpaRepository<CartItemEntity, Long> {
    CartItemEntity findByCartAndProduct(CartEntity cart, ProductEntity product);

    @Query("""
        SELECT ci
        FROM CartItemEntity ci
        JOIN FETCH ci.product
        WHERE ci.cart = :cart
        ORDER BY ci.no ASC
        """)
    List<CartItemEntity> findByCartOrderByNoAsc(@Param("cart") CartEntity cart);


    @Query("""
            SELECT COALESCE(SUM(p.price * ci.quantity), 0)
            FROM CartItemEntity ci
            JOIN ci.product p
            WHERE ci.no IN :nos
            """)
    int calcTotalPrice(@Param("nos") List<Long> nos);
}
