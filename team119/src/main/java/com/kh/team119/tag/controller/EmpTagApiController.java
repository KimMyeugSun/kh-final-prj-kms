package com.kh.team119.tag.controller;

import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.tag.dto.RespTagLookUp;
import com.kh.team119.tag.service.EmpTagService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequiredArgsConstructor
@RequestMapping(path={"/api/emp-tag", "/management/api/emp-tag"})
public class EmpTagApiController {
    private final EmpTagService service;

    @GetMapping("/{eno}")
    public ApiResponse<RespTagLookUp> getEmpTag(@PathVariable Long eno) {
        var result = service.getEmpTag(eno);

        return ResponseFactory
                .success(result);
    }
}
