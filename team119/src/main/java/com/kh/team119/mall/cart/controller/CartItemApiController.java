package com.kh.team119.mall.cart.controller;


import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.mall.cart.dto.request.CartItemReqDto;
import com.kh.team119.mall.cart.dto.response.CartItemRespDto;
import com.kh.team119.mall.cart.service.CartItemService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/cartItem")
@RequiredArgsConstructor
public class CartItemApiController {

    private final CartItemService cartItemService;

    // 장바구니 추가
    @PostMapping
    public ApiResponse<Void> save(@RequestBody CartItemReqDto reqDto) {
        cartItemService.save(reqDto);

        return ResponseFactory.success("CREATED");
    }

    // 장바구니 조회
    @GetMapping("{eno}")
    public ApiResponse<List<CartItemRespDto>> getCartItem(@PathVariable Long eno) {

        return ResponseFactory.success(cartItemService.getCartItems(eno));
    }

    // 장바구니 삭제
    @DeleteMapping("{no}")
    public ApiResponse<Void> deleteItem(@PathVariable Long no) {
        cartItemService.deleteItem(no);

        return ResponseFactory.success("DELETED");
    }

    // 장바구니 수정
    @PutMapping("{no}")
    public ApiResponse<Void> updateQuantity(
            @PathVariable Long no,
            @RequestBody CartItemReqDto reqDto
    ) {
        cartItemService.updateQuantity(no, reqDto.getQuantity());
        return ResponseFactory.success("UPDATED");
    }

    // 장바구니 총 결제 금액 계산
    @GetMapping("/totalPrice")
    public ApiResponse<Integer> clacTotalPrice(@RequestParam List<Long> nos) {

        return ResponseFactory.success(cartItemService.calcTotalPrice(nos));
    }
}
