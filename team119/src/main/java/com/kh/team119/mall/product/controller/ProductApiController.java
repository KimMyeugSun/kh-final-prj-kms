package com.kh.team119.mall.product.controller;

import com.kh.team119.common.FileController;
import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.mall.product.dto.request.ProductReqDto;
import com.kh.team119.mall.product.dto.response.ProductRespDto;
import com.kh.team119.mall.product.service.ProductService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.data.web.PageableDefault;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping(path = {"management/api/product", "api/product"})
@RequiredArgsConstructor
public class ProductApiController {
    private final ProductService productService;
    private final FileController fileCtrl;

    @Value("${PRODUCT_STORAGE_PATH.IMG}") String productUploadPath;

    // insert (admin)
    @PostMapping
    public ApiResponse<Void> save(
            ProductReqDto productReqDto,
            MultipartFile file
            ) {

        if(file != null) {
            String img = fileCtrl.save(file, productUploadPath);
            productReqDto.setUrl(img);
        }

        productService.save(productReqDto);

        return ResponseFactory.success("CREATED");
    }


    // selectOne
    @GetMapping("{no}")
    public ApiResponse<ProductRespDto> findById(@PathVariable Long no) {

        return ResponseFactory.success(productService.findById(no));
    }


    // selectAll
    @GetMapping
    public ApiResponse<List<ProductRespDto>> findAll(
            @PageableDefault(size = 10, sort = "no", direction = Sort.Direction.DESC)
                                           Pageable pageable
    ) {

        return ResponseFactory.success(productService.findAll(pageable));
    }

    // selectAll - page
    @GetMapping("/paging")
    public ApiResponse<Page<ProductRespDto>> getListWithPage(
            @PageableDefault(size = 10, sort = "no", direction = Sort.Direction.DESC)
            Pageable pageable,
            @RequestParam(required = false) String keyword
    ) {
        Page<ProductRespDto> page = productService.getListWithPage(pageable, keyword);

        return ResponseFactory.success(page);
    }


    // delete
    @DeleteMapping("{no}")
    public ApiResponse<Void> deleteById(@PathVariable Long no) {
        productService.delete(no);

        return ResponseFactory.success("DELETED");

    }


    // update
    @PutMapping("{no}")
    public ApiResponse<Void> updateById(
            ProductReqDto reqDto,
            MultipartFile file,
            @PathVariable Long no
    ) {
        if(file != null) {
            String img = fileCtrl.save(file, productUploadPath);
            reqDto.setUrl(img);
        } else {
            String currentUrl = productService.findById(no).getUrl();
            reqDto.setUrl(currentUrl);
        }

        productService.update(reqDto, no);


        return ResponseFactory.success("UPDATED");
    }


}
