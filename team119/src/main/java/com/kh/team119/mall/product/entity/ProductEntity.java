package com.kh.team119.mall.product.entity;

import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.mall.product.dto.request.ProductReqDto;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "PRODUCT")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ProductEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_no", nullable = false, foreignKey = @ForeignKey(name = "FK_CATEGORY_NO_TO_PRODUCT"))
    private ProductCategoryEntity category;

    private String name;
    private String description;
    private int price;
    private String url;

    @Builder.Default
    private int stock = 0;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;

    public void delete(ProductEntity entity) {
        this.deletedAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
    }

    public void update(ProductReqDto reqDto, ProductCategoryEntity categoryEntity) {
        this.category = categoryEntity;
        this.name = reqDto.getName();
        this.description = reqDto.getDescription();
        this.price = reqDto.getPrice();
        this.url = reqDto.getUrl();
        this.stock = reqDto.getStock();
        this.updatedAt = LocalDateTime.now();
    }

    public void minusStock(int quantity) {
        if(this.stock < quantity) {
            throw new Team119Exception(ErrorCode.NOT_ENOUGH_STOCK);
        }
        this.stock -= quantity;
    }
}
