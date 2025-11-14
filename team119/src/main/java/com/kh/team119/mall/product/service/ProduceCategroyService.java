package com.kh.team119.mall.product.service;


import com.kh.team119.mall.product.dto.response.ProductCategoryRespDto;
import com.kh.team119.mall.product.entity.ProductCategoryEntity;
import com.kh.team119.mall.product.repository.ProductCategoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ProduceCategroyService {

    private final ProductCategoryRepository productCategoryRepository;

    public ProductCategoryEntity findById(Long categoryNo) {
        return productCategoryRepository.findById(categoryNo).get();
    }

    public List<ProductCategoryRespDto> findAll() {
        return productCategoryRepository.findAll().stream().map(ProductCategoryRespDto::from).toList();
    }
}
