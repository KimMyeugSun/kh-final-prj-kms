package com.kh.team119.common.controller;

import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.common.service.PublicService;
import com.kh.team119.department.dto.RespDepartmantList;
import com.kh.team119.employee.EmpGradeType;
import com.kh.team119.employee.dto.RespEmpGradeList;
import com.kh.team119.employee.service.EmployeeService;
import com.kh.team119.faq.category.dto.RespFaqCategoryList;
import com.kh.team119.faq.category.service.FaqCategoryService;
import com.kh.team119.healthBoard.service.HealthBoardService;
import com.kh.team119.role.entity.RoleEntity;
import com.kh.team119.roletype.RoleType;
import com.kh.team119.security.SecurityJwtUtil;
import com.kh.team119.security.refresh.token.RefreshTokenService;
import com.kh.team119.tag.dto.RespTagLookUp;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Arrays;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping(path = {"/api/public"})
@RequiredArgsConstructor
public class PublicApiController {
    private final PublicService service;
    private final HealthBoardService healthBoardService;

    @GetMapping("/department/look-up")
    public ApiResponse<RespDepartmantList> departmentLookUp() {
        var result = service.departmentLookUp();

        return ResponseFactory
                .success(result);
    }

    @GetMapping("/grade/look-up")
    public ApiResponse<RespEmpGradeList> gradeLookUp() {

        return ResponseFactory
                .success(RespEmpGradeList.builder()
                        .empGradeNameList(Arrays.stream(EmpGradeType.values())
                                .map(EmpGradeType::getDesc)
                                .toList())
                        .build());

    }

    @GetMapping("/role/look-up")
    public ApiResponse<List<String>> roleLookUp() {
//        var result = service.roleLookUp();

        var result = Arrays.stream(RoleType.values())
                .map(RoleType::name)
                .toList();

        return ResponseFactory
                .success(result);
    }

    private final RefreshTokenService refreshTokenService;
    private final SecurityJwtUtil securityJwtUtil;
    private final EmployeeService employeeService;

    @PostMapping("/refresh")
    public ResponseEntity<?> refresh(@RequestHeader("RefreshToken") String refreshToken) {

        if (refreshTokenService.isValid(refreshToken)) {
            String id = securityJwtUtil.findIdByRefreshToken(refreshToken);
            var empEntity = employeeService.findEntityByEmpId(id);
            if (empEntity == null) {
                return ResponseEntity
                        .status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("errorMsg", "사용자 정보가 존재하지 않습니다. 다시 로그인 해주세요."));
            }

            refreshTokenService.deleteRefreshToken(id);
            String newRefreshToken = securityJwtUtil.createRefreshToken(id);
            refreshTokenService.saveRefreshToken(id, newRefreshToken);

            List<RoleType> userRole = empEntity.getRoles().stream().map(RoleEntity::getRoleType).toList();
            StringBuilder roles = new StringBuilder();
            for (RoleType role : userRole) {
                roles.append(role).append(",");
            }
            if (!roles.isEmpty()) {
                roles.deleteCharAt(roles.length() - 1); // 마지막 쉼표 제거
            }

            String newAccessToken = securityJwtUtil.createAccessToken(id, empEntity.getEmpName(), roles.toString());

            return ResponseEntity
                    .ok()
                    .header("Authorization", "Bearer " + newAccessToken)
                    .header("RefreshToken", newRefreshToken)
                    .build();
        }
        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .body(Map.of("errorMsg", "리프레시 토큰이 만료되었습니다. 다시 로그인 해주세요."));
    }

    private final FaqCategoryService faqCategoryService;

    @GetMapping("/faq/category/look-up")
    public ApiResponse<RespFaqCategoryList> faqCategoryLookUp() {
        var result = faqCategoryService.findAll();

        return ResponseFactory
                .success(result);
    }

    @GetMapping("/tag/list")
    public ApiResponse<RespTagLookUp> healthBoardTagList() {
        return ResponseFactory
                .success(RespTagLookUp.tagNameLookUp());
    }

}
