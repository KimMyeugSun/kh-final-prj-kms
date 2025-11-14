package com.kh.team119.mall.order.controller;


import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.mall.order.dto.request.OrderReqDto;
import com.kh.team119.mall.order.dto.response.OrderManagementRespDto;
import com.kh.team119.mall.order.dto.response.OrderRespDto;
import com.kh.team119.mall.order.service.OrderService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = {"management/api/order", "api/order"})
@RequiredArgsConstructor
public class OrderApiController {

    private final OrderService orderService;

    // 결제 후 주문 등록
    @PostMapping
    public ApiResponse<Map<String, Long>> save(@RequestBody OrderReqDto reqDto) {
        Long updatedPoints = orderService.save(reqDto);

        Map<String, Long> map = new HashMap<>();
        map.put("welfarePoints", updatedPoints);

        return ResponseFactory.success(map);
    }

    // 주문 목록 조회 (user)
    @GetMapping("{eno}")
    public ApiResponse<List<OrderRespDto>> findAllByEnoWithItems(@PathVariable Long eno) {
        List<OrderRespDto> orderRespDtoList = orderService.findAllByEnoWithItems(eno);

        return ResponseFactory.success(orderRespDtoList);
    }

    // 주문 상세 조회
    @GetMapping("{eno}/detail/{no}")
    public ApiResponse<OrderRespDto> findOneOrder(@PathVariable Long eno, @PathVariable Long no) {

        return ResponseFactory.success(orderService.findOneByEnoAndNo(eno, no));
    }


    // 전체 사원 주문 목록 조회 (admin)
    @GetMapping
    public ApiResponse<Page<OrderManagementRespDto>> getAllOrders(
            @RequestParam(required = false) String keyword,
            @PageableDefault(size = 10, sort = "createdAt", direction = Sort.Direction.DESC)
            Pageable pageable
    ) {
        return ResponseFactory.success(orderService.getAllOrders(keyword, pageable));    }

    // 사원 주문 목록 상세 조회 (admin)
    @GetMapping("/detail/{no}")
    public ApiResponse<OrderManagementRespDto> findById(@PathVariable Long no) {

        return ResponseFactory.success(orderService.findById(no));
    }

}
