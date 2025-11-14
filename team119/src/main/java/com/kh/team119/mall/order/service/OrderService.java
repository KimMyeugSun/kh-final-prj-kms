package com.kh.team119.mall.order.service;

import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.mall.cart.entity.CartItemEntity;
import com.kh.team119.mall.cart.repository.CartItemRepository;
import com.kh.team119.mall.order.dto.request.OrderReqDto;
import com.kh.team119.mall.order.dto.response.OrderManagementRespDto;
import com.kh.team119.mall.order.dto.response.OrderRespDto;
import com.kh.team119.mall.order.entity.OrderEntity;
import com.kh.team119.mall.order.entity.OrderItemEntity;
import com.kh.team119.mall.order.repository.OrderItemRepository;
import com.kh.team119.mall.order.repository.OrderRepository;
import com.kh.team119.mall.product.repository.ProductRepository;
import com.kh.team119.welfarepointrecord.OccurrenceType;
import com.kh.team119.welfarepointrecord.service.WelfarePointRecordService;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class OrderService {

    private final OrderRepository orderRepository;
    private final OrderItemRepository orderItemRepository;
    private final EmployeeRepository employeeRepository;
    private final ProductRepository productRepository;
    private final CartItemRepository cartItemRepository;
    private final WelfarePointRecordService welfarePointRecordService;

    public Long save(OrderReqDto reqDto) {
        // 1. 주문자 조회
        EmployeeEntity employee = employeeRepository.findByEno(reqDto.getEno());

        if(employee == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);
        }

        // 2. 주문 저장
        OrderEntity order = reqDto.toEntity(employee);
        orderRepository.save(order);

        // 3. 장바구니 아이템 조회 후 주문 상품 저장 및 재고 처리
        if(reqDto.getItems() != null && !reqDto.getItems().isEmpty()) {
            List<CartItemEntity> cartItemEntityList = cartItemRepository.findAllById(reqDto.getItems());

            for(CartItemEntity cartItem : cartItemEntityList) {
                OrderItemEntity orderItem = OrderItemEntity.builder()
                        .order(order)
                        .product(cartItem.getProduct())
                        .price(cartItem.getProduct().getPrice())
                        .quantity(cartItem.getQuantity())
                        .build();

                orderItemRepository.save(orderItem);

                // 재고 차감
                var product = cartItem.getProduct();
                product.minusStock(cartItem.getQuantity());
                productRepository.save(product);


                // 장바구니 비우기
                cartItemRepository.delete(cartItem);
            }
        }
        // 4. 복지 포인트 차감
        if(employee.getWelfarePoints() < reqDto.getTotalPrice()) {
            throw new Team119Exception(ErrorCode.INSUFFICIENT_WELFARE_POINTS);
        }
        employee.minusWelfarePoints(reqDto.getTotalPrice());

        // 5. 복지 포인트 이력 테이블에 추가
        try {
            String desc = String.format("지킴이몰 결제 차감 %d 포인트",
                    reqDto.getTotalPrice()
            );
            welfarePointRecordService.registerWelfarePointRecord(
                    employee.getEno(),
                    -reqDto.getTotalPrice(),
                    OccurrenceType.MALL,
                    desc
            );
        } catch (Exception e) {
            // 랭킹 쪽과 통일감 있게 예외 매핑
            throw new Team119Exception(ErrorCode.FAILED_TO_SAVE_WELFARE_POINT);
            // 혹은 기존 코드에 맞는 에러코드 사용
        }


        // 포인트 잔액 반환
        return employee.getWelfarePoints();
    }

    public List<OrderRespDto> findAllByEnoWithItems(Long eno) {
          List<OrderEntity> orderEntityList = orderRepository.findAllByEnoWithItems(eno);

          List<OrderRespDto> respDtoList = orderEntityList.stream().map(OrderRespDto::from).toList();

          return respDtoList;
    }

    public OrderRespDto findOneByEnoAndNo(Long eno, Long no) {
        OrderEntity entity = orderRepository.findByEnoAndNo(eno, no);

        return OrderRespDto.from(entity);
    }


    public Page<OrderManagementRespDto> getAllOrders(String keyword, Pageable pageable) {
        Page<OrderEntity> orders;

        if(keyword != null && !keyword.isBlank()) {
            orders = orderRepository.searchByKeyword(keyword, pageable);
        } else {
            orders = orderRepository.findAll(pageable);
        }

        return orders.map(OrderManagementRespDto::from);
    }

    public OrderManagementRespDto findById(Long no) {
        OrderEntity entity = orderRepository.findById(no).get();

        return OrderManagementRespDto.from(entity);
    }
}
