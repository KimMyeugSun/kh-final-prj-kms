package com.kh.team119.mall.order.entity;


import com.kh.team119.mall.product.entity.ProductEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ORDER_ITEM")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class OrderItemEntity {

    @Id @GeneratedValue(strategy =  GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "productNo", nullable = false, foreignKey = @ForeignKey(name = "FK_ORDER_ITEM_PRODUCT"))
    private ProductEntity product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "orderNo", nullable = false, foreignKey = @ForeignKey(name = "FK_ORDER_ITEM_ORDER"))
    private OrderEntity order;

    @Column(nullable = false)
    private int price;

    @Column(nullable = false)
    private int quantity;

}
