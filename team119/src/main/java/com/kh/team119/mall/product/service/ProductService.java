package com.kh.team119.mall.product.service;

import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.mall.product.dto.request.ProductReqDto;
import com.kh.team119.mall.product.dto.response.ProductRespDto;
import com.kh.team119.mall.product.entity.ProductCategoryEntity;
import com.kh.team119.mall.product.entity.ProductEntity;
import com.kh.team119.mall.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ProductService {

    private final ProductRepository productRepository;
    private final ProduceCategroyService produceCategroyService;

    public void save(ProductReqDto reqDto) {
        ProductCategoryEntity category = produceCategroyService.findById(reqDto.getCategoryNo());
        ProductEntity entity = reqDto.toEntity(category);

        productRepository.save(entity);

    }

    public ProductRespDto findById(Long no) {
        ProductEntity entity = productRepository.findById(no)
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_PRODUCT));

        ProductRespDto respDto = ProductRespDto.from(entity);

        return respDto;
    }

    public List<ProductRespDto> findAll(Pageable pageable) {
        Page<ProductEntity> productEntityList = productRepository.findAllByDeletedAtIsNull(pageable);

        return productEntityList.stream().map(ProductRespDto::from).toList();
    }

    public void delete(Long no) {
        ProductEntity entity = productRepository.findById(no)
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_PRODUCT));;

        entity.delete(entity);
    }

    public void update(ProductReqDto reqDto, Long no) {
        ProductEntity entity = productRepository.findById(no)
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_PRODUCT));

        ProductCategoryEntity categoryEntity = produceCategroyService.findById(reqDto.getCategoryNo());

        entity.update(reqDto, categoryEntity);
    }

    public Page<ProductRespDto> getListWithPage(Pageable pageable, String keyword) {
        Page<ProductEntity> page;

        if (keyword == null || keyword.trim().isEmpty()) {
            page = productRepository.findAllByDeletedAtIsNull(pageable);
        } else {
            page = productRepository.findAllByDeletedAtIsNullAndNameContainingIgnoreCase(keyword, pageable);
        }

        return  page.map(ProductRespDto::from);
    }
}
