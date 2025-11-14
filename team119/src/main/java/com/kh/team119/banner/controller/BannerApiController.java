package com.kh.team119.banner.controller;

import com.kh.team119.banner.dto.RespBanner;
import com.kh.team119.banner.service.BannerService;
import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/banners")
@RequiredArgsConstructor
public class BannerApiController {
    private final BannerService bannerService;

    @GetMapping("/{eno}")
    public ApiResponse<List<RespBanner>> getBanners(@PathVariable Long eno) {
        var result = bannerService.getBanners(eno);

        return ResponseFactory
                .success(result);
    }
}
