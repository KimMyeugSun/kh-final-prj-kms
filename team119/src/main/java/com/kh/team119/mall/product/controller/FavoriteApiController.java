package com.kh.team119.mall.product.controller;


import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.mall.product.dto.request.FavoriteReqDto;
import com.kh.team119.mall.product.dto.response.ProductRespDto;
import com.kh.team119.mall.product.service.FavoriteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("api/favorite")
@RequiredArgsConstructor
public class FavoriteApiController {

    private final FavoriteService favoriteService;


    // 상품 찜하기
    @PostMapping
    public ApiResponse<Object> save(@RequestBody FavoriteReqDto reqDto) {
        favoriteService.save(reqDto);

        return ResponseFactory.success("CREATED", null);
    }


    // 내 찜 상품 번호 리스트 조회 - 지킴이몰 상품 조회용
    @GetMapping("{eno}")
    public ApiResponse<List<Long>> findMyFavoriteNos(@PathVariable Long eno) {

        return ResponseFactory.success("SUCCESS", favoriteService.findMyFavoriteNos(eno));
    }


    // 내 찜 상품 전체 정보 조회 - 찜한 목록 상품 조회용
    @GetMapping("{eno}/products")
    public ApiResponse<List<ProductRespDto>> findMyFavorites(@PathVariable Long eno) {
        return ResponseFactory.success("SUCCESS", favoriteService.findMyFavorites(eno));
    }



    // 찜 해제
    @DeleteMapping
    public ApiResponse<Object> delete(@RequestBody FavoriteReqDto reqDto) {
        favoriteService.delete(reqDto);

        return ResponseFactory.success("DELETED", null);
    }


}
