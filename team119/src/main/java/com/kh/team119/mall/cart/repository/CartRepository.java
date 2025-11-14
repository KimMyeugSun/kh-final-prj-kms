package com.kh.team119.mall.cart.repository;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.mall.cart.entity.CartEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface CartRepository extends JpaRepository<CartEntity, Long> {

    CartEntity findByEmployee(EmployeeEntity employee);
}
