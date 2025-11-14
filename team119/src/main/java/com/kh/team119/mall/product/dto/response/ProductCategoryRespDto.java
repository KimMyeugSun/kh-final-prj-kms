package com.kh.team119.mall.product.dto.response;

import com.kh.team119.mall.product.entity.ProductCategoryEntity;
import lombok.Getter;

@Getter
public class ProductCategoryRespDto {

    private Long no;
    private String categoryName;

    public static ProductCategoryRespDto from(ProductCategoryEntity entity) {
        ProductCategoryRespDto respDto = new ProductCategoryRespDto();
        respDto.no = entity.getNo();
        respDto.categoryName = entity.getName();

        return respDto;
    }
}
