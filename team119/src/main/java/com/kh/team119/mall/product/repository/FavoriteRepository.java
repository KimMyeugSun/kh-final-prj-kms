package com.kh.team119.mall.product.repository;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.mall.product.dto.response.ProductRespDto;
import com.kh.team119.mall.product.entity.FavoriteEntity;
import com.kh.team119.mall.product.entity.ProductEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface FavoriteRepository extends JpaRepository<FavoriteEntity, Long> {

    void deleteByProductEntityAndEmployeeEntity(ProductEntity product, EmployeeEntity employee);

    @Query("""
            select f.productEntity.no
            from FavoriteEntity f
            where f.employeeEntity.eno = :eno
            """)
    List<Long> findProductNosByEno(Long eno);


    /*
    *   select new ... : Entity 자체가 아니라, 내가 원하는 필드만 뽑아서 DTO 객체로 바로 생성해줌
    *   com.kh.team119.mall.product.dto.response.ProductRespDto : 생성자 호출 구문
    */
    @Query("""
            select new com.kh.team119.mall.product.dto.response.ProductRespDto(
            p.no, p.category.no, p.category.name, p.name, p.description, p.price,
            p.url, p.stock, p.createdAt, p.updatedAt, p.deletedAt, true)
            from FavoriteEntity f join f.productEntity p
            where f.employeeEntity.eno = :eno
            """)
    List<ProductRespDto> findMyFavorites(Long eno);
}
