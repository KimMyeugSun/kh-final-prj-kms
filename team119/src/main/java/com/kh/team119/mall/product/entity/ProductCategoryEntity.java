package com.kh.team119.mall.product.entity;


import jakarta.persistence.*;
import lombok.*;

import javax.swing.table.TableCellEditor;

@Entity
@Table(name = "PRODUCT_CATEGORY")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class ProductCategoryEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @Column(nullable = false, length = 100)
    private String name;

}
