package com.kh.team119.food.controller;

import com.kh.team119.food.dto.FoodDto;
import com.kh.team119.food.service.FoodCatalogService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/foods")
@RequiredArgsConstructor
public class FoodCatalogController {

    private final FoodCatalogService service;

    @GetMapping
    public Page<FoodDto.Resp> list(@RequestParam(required = false) String q,
                                   @RequestParam(defaultValue = "0") int page,
                                   @RequestParam(defaultValue = "20") int size) {
        return service.list(q, PageRequest.of(page, size));
    }

    @GetMapping("/{id}")
    public FoodDto.Resp get(@PathVariable Long id) {
        return service.get(id);
    }


    @GetMapping("/by-name")
    public FoodDto.Resp getByName(@RequestParam String name) {
        return service.getByName(name);
    }
}
