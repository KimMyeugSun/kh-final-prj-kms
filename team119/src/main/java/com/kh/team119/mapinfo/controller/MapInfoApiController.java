package com.kh.team119.mapinfo.controller;

import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.mapinfo.dto.RespMap;
import com.kh.team119.mapinfo.service.MapInfoService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/api/public")
public class MapInfoApiController {
    private final MapInfoService service;

    @GetMapping("/map-info")
    public ResponseEntity<ApiResponse<RespMap>> findHospitals(
            @RequestParam Double lon,
            @RequestParam Double lat,
            @RequestParam Double radius,
            @RequestParam(required = false, defaultValue = "") List<String> filters) {

        var result = service.searchMapInfo(lon, lat, radius, filters);

        return ResponseEntity
                .ok(ResponseFactory.success(result));
    }

    @GetMapping("/places/search")
    public ResponseEntity<ApiResponse<?>> searchPlaces(@RequestParam String query) {
        return ResponseEntity
                .ok(ResponseFactory.success(service.searchPlaces(query)));
    }
}
