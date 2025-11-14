package com.kh.team119.mall.cart.dto.response;

import com.kh.team119.mall.cart.entity.CartItemEntity;
import lombok.Getter;

@Getter
public class CartItemRespDto {

    private Long no;
    private Long productNo;
    private int quantity;

    private String productName;
    private String productUrl;
    private int price;

    public static CartItemRespDto from(CartItemEntity entity) {

        CartItemRespDto respDto = new CartItemRespDto();
        respDto.no = entity.getNo();
        respDto.productNo = entity.getProduct().getNo();
        respDto.quantity = entity.getQuantity();

        respDto.productName = entity.getProduct().getName();
        respDto.productUrl = entity.getProduct().getUrl();
        respDto.price = entity.getProduct().getPrice();

        return respDto;
    }
}
