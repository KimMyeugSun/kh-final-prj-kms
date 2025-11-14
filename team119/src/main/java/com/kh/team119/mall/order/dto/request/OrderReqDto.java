package com.kh.team119.mall.order.dto.request;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.mall.order.entity.OrderEntity;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class OrderReqDto {

    private Long eno;
    private Long totalPrice;
    private String phone;
    private String address;
    private String addressDetail;

    // 주문 상품 목록
    private List<Long> items;

    public OrderEntity toEntity(EmployeeEntity employee) {
        return OrderEntity.builder()
                .employee(employee)
                .totalPrice(this.totalPrice)
                .phone(this.phone)
                .address(this.address)
                .addressDetail(this.addressDetail)
                .build();
    }

    @Getter
    @Setter
    public static class OrderItemDto {
        private Long productNo;
        private int price;
        private int quantity;
    }
}
