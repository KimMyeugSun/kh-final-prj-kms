package com.kh.team119.mall.product.service;


import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.mall.product.dto.request.FavoriteReqDto;
import com.kh.team119.mall.product.dto.response.ProductRespDto;
import com.kh.team119.mall.product.entity.FavoriteEntity;
import com.kh.team119.mall.product.entity.ProductEntity;
import com.kh.team119.mall.product.repository.FavoriteRepository;
import com.kh.team119.mall.product.repository.ProductRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FavoriteService {

    private final FavoriteRepository favoriteRepository;
    private final ProductRepository productRepository;
    private final EmployeeRepository employeeRepository;


    public void save(FavoriteReqDto reqDto) {
        ProductEntity product = productRepository.findById(reqDto.getPno()).get();
        EmployeeEntity employee = employeeRepository.findByEno(reqDto.getEno());

        FavoriteEntity entity = reqDto.toEntity(product, employee);

        favoriteRepository.save(entity);
    }

    public List<Long> findMyFavoriteNos(Long eno) {
        return favoriteRepository.findProductNosByEno(eno);
    }


    public List<ProductRespDto> findMyFavorites(Long eno) {
        return favoriteRepository.findMyFavorites(eno);
    }


    public void delete(FavoriteReqDto reqDto) {
        ProductEntity product = productRepository.findById(reqDto.getPno()).get();
        EmployeeEntity employee = employeeRepository.findByEno(reqDto.getEno());

        favoriteRepository.deleteByProductEntityAndEmployeeEntity(product, employee);
    }



}
