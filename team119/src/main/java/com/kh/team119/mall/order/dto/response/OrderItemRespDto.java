package com.kh.team119.mall.order.dto.response;

import com.kh.team119.mall.order.entity.OrderItemEntity;
import lombok.Getter;

@Getter
public class OrderItemRespDto {
    private String productName;
    private int price;
    private int quantity;

    public static OrderItemRespDto from(OrderItemEntity entity) {
        OrderItemRespDto respDto = new OrderItemRespDto();
        respDto.productName = entity.getProduct().getName();
        respDto.price = entity.getPrice();
        respDto.quantity = entity.getQuantity();

        return respDto;
    }
}