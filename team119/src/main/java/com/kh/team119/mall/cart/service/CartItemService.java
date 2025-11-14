package com.kh.team119.mall.cart.service;


import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.mall.cart.dto.request.CartItemReqDto;
import com.kh.team119.mall.cart.dto.response.CartItemRespDto;
import com.kh.team119.mall.cart.entity.CartEntity;
import com.kh.team119.mall.cart.entity.CartItemEntity;
import com.kh.team119.mall.cart.repository.CartItemRepository;
import com.kh.team119.mall.cart.repository.CartRepository;
import com.kh.team119.mall.product.entity.ProductEntity;
import com.kh.team119.mall.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CartItemService {

    private final CartRepository cartRepository;
    private final CartItemRepository itemRepository;
    private final ProductRepository productRepository;
    private final EmployeeRepository employeeRepository;

    public void save(CartItemReqDto reqDto) {
        // 1. 사용자 조회
        EmployeeEntity employee = employeeRepository.findByEno(reqDto.getEno());
        if(employee == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);
        }

        // 2.장바구니 조회 후 없으면 생성
        CartEntity cart = cartRepository.findByEmployee(employee);
        if(cart == null) {
            cart = cartRepository.save(CartEntity.builder()
                    .employee(employee)
                    .build());
        }

        // 3. 상품 조회
        ProductEntity product = productRepository.findById(reqDto.getProductNo()).get();
        // 상품 없으면 에러 처리
        if(product == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_PRODUCT);
        }

        // 4. 장바구니 아이템 조회
        CartItemEntity cartItem = itemRepository.findByCartAndProduct(cart, product);

        // 5. 있으면 수량만 추가, 없으면 생성
        if(cartItem != null) {
            cartItem.changeQuantity(cartItem.getQuantity() + reqDto.getQuantity());
        } else {
            CartItemEntity newItem = CartItemEntity.builder()
                    .cart(cart)
                    .product(product)
                    .quantity(reqDto.getQuantity())
                    .build();
            itemRepository.save(newItem);
        }
    }

    public List<CartItemRespDto> getCartItems(Long eno) {
        EmployeeEntity employee = employeeRepository.findByEno(eno);
        CartEntity cart = cartRepository.findByEmployee(employee);

        if(cart == null) {
            return Collections.emptyList();
        }

        List<CartItemEntity> cartItemEntityList = itemRepository.findByCartOrderByNoAsc(cart);

        return cartItemEntityList.stream().map(CartItemRespDto::from).toList();
    }

    public void deleteItem(Long no) {
        CartItemEntity entity = itemRepository.findById(no).get();
        itemRepository.delete(entity);
    }

    public int calcTotalPrice(List<Long> nos) {
        return itemRepository.calcTotalPrice(nos);
    }

    public void updateQuantity(Long no, int quantity) {
        CartItemEntity entity = itemRepository.findById(no).get();
        entity.changeQuantity(quantity);

    }
}
