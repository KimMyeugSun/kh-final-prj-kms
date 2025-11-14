package com.kh.team119.mall.order.dto.response;

import com.kh.team119.mall.order.entity.OrderEntity;
import lombok.Getter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
public class OrderRespDto {

    private Long no;
    private Long eno;

    private Long totalPrice;
    private String phone;
    private String address;
    private String addressDetail;
    private LocalDateTime createdAt;

    private List<OrderItemRespDto> items;


    public static OrderRespDto from(OrderEntity entity) {
        OrderRespDto respDto = new OrderRespDto();
        respDto.no = entity.getNo();
        respDto.eno = entity.getEmployee().getEno();
        respDto.totalPrice = entity.getTotalPrice();
        respDto.phone = entity.getPhone();
        respDto.address = entity.getAddress();
        respDto.addressDetail = entity.getAddressDetail();
        respDto.createdAt = entity.getCreatedAt();

        respDto.items = entity.getItems().stream().map(OrderItemRespDto::from).toList();

        return respDto;
    }

}
