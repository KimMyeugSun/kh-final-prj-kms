package com.kh.team119.mall.order.entity;


import com.kh.team119.employee.entity.EmployeeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "ORDERS")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class OrderEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eno", nullable = false, foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_ORDERS"))
    private EmployeeEntity employee;

    @Column(nullable = false)
    private Long totalPrice;

    @Column(length = 20)
    private String phone;
    private String address;
    private String addressDetail;

    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime paidAt;
    private LocalDateTime cancelledAt;

    @Builder.Default
    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItemEntity> items = new ArrayList<>();

}
