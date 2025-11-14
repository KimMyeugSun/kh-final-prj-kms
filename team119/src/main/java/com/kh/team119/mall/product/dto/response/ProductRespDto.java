package com.kh.team119.mall.product.dto.response;

import com.kh.team119.mall.product.entity.ProductCategoryEntity;
import com.kh.team119.mall.product.entity.ProductEntity;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
@NoArgsConstructor
public class ProductRespDto {

    private Long no;
    private Long categoryNo;
    private String categoryName;
    private String name;
    private String description;
    private int price;
    private String url;
    private int stock;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    private boolean isFavorite;


    public static ProductRespDto from(ProductEntity entity) {
        ProductRespDto dto = new ProductRespDto();
        dto.no = entity.getNo();
        dto.categoryNo = entity.getCategory().getNo();
        dto.categoryName = entity.getCategory().getName();
        dto.name = entity.getName();
        dto.description = entity.getDescription();
        dto.price = entity.getPrice();
        dto.url = entity.getUrl();
        dto.stock = entity.getStock();
        dto.createdAt = entity.getCreatedAt();
        dto.updatedAt = entity.getUpdatedAt();
        dto.deletedAt = entity.getDeletedAt();
        dto.isFavorite = false;

        return dto;
    }
}
