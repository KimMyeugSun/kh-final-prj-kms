package com.kh.team119.mall.cart.entity;


import com.kh.team119.mall.product.entity.ProductEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "CART_ITEM")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class CartItemEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productNo", nullable = false, foreignKey = @ForeignKey(name = "FK_PRODUCT_NO_TO_CART_ITEM"))
    private ProductEntity product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "cartNo", nullable = false, foreignKey = @ForeignKey(name = "FK_CART_NO_TO_CART_ITEM"))
    private CartEntity cart;

    private int quantity;

    public void changeQuantity(int quantity) {
        this.quantity = quantity;
    }
}
