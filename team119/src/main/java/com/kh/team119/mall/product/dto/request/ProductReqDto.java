package com.kh.team119.mall.product.dto.request;

import com.kh.team119.mall.product.entity.ProductCategoryEntity;
import com.kh.team119.mall.product.entity.ProductEntity;
import lombok.Getter;
import lombok.Setter;

@Setter
@Getter
public class ProductReqDto {
    private Long categoryNo;
    private String name;
    private String description;
    private int price;
    private String url;
    private int stock;

    public ProductEntity toEntity(ProductCategoryEntity categoryEntity) {
        return ProductEntity.builder()
                .category(categoryEntity)
                .name(this.name)
                .description(this.description)
                .price(this.price)
                .url(this.url)
                .stock(this.stock)
                .build();
    }
}
