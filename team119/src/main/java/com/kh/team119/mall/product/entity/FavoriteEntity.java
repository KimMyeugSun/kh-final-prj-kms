package com.kh.team119.mall.product.entity;


import com.kh.team119.employee.entity.EmployeeEntity;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "FAVORITE")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class FavoriteEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    // 찜 하나에 상품 여러개
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "pno", nullable = false, foreignKey = @ForeignKey(name = "FK_PRODUCT_NO_TO_FAVORITE"))
    private ProductEntity productEntity;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eno", nullable = false, foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_FAVORITE"))
    private EmployeeEntity employeeEntity;

}
