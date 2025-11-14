package com.kh.team119.mall.product.dto.request;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.mall.product.entity.FavoriteEntity;
import com.kh.team119.mall.product.entity.ProductEntity;
import lombok.Getter;

@Getter
public class FavoriteReqDto {
    private Long pno;
    private Long eno;


    public FavoriteEntity toEntity(ProductEntity product, EmployeeEntity employee) {
        return FavoriteEntity.builder()
                .productEntity(product)
                .employeeEntity(employee)
                .build();
    }
}
