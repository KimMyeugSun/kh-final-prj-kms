package com.kh.team119.authentication.controller;

import com.kh.team119.authentication.SecurityAuthVo;
import com.kh.team119.authentication.dto.ReqAuthority;
import com.kh.team119.authentication.dto.RespAuthority;
import com.kh.team119.authentication.dto.RespPull;
import com.kh.team119.common.FileController;
import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.employee.dto.ReqChangePassword;
import com.kh.team119.employee.service.EmployeeService;
import com.kh.team119.security.SecurityUserDetails;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.Map;

@RestController
@RequestMapping(path = {"/management", "/"})
@RequiredArgsConstructor
public class AccountApiController {
    private final EmployeeService service;
    private final FileController fileCtrl;

    @Value("${PROFILE_STORAGE_PATH.IMG}")
    private String profileStoragePath;

    //!< 회원가입
    @PostMapping("/sign-up")
    public ApiResponse<Void> signUp(SecurityAuthVo vo, @RequestParam(value = "profile", required = false) MultipartFile profile) {

        String fileName = null;

        if(profile != null) {
            fileName = fileCtrl.save(profile, profileStoragePath);
        }

        service.signUp(vo, fileName);

        return ResponseFactory
                .success("회원가입 성공");
    }

    //!< 토큰으로 사용자 정보 가져오기 (로그인 성공 후 프로미스로 처리 )
    @GetMapping("/pull")
    public ApiResponse<RespPull> pull(Authentication authentication) {
        SecurityUserDetails Details = (SecurityUserDetails) authentication.getPrincipal();
        var empDto = service.findByEmpId(Details.getUsername());//!<  사원정보 조회

        empDto.setRoles(Details.getUserRole());

        return ResponseFactory
                .success(
                        RespPull.builder()
                                .name(Details.getUserNick())
                                .employee(empDto)
                                .build());
    }

    @PostMapping("/api/authority")
    public ApiResponse<RespAuthority> addAuthority(@RequestBody ReqAuthority dto) {
        var result = service.updateAuthority(dto);

        return ResponseFactory
                .success(result);
    }

    @PutMapping("/api/change-password/{eno}")
    public ApiResponse<Void> changePassword(@PathVariable Long eno, @RequestBody ReqChangePassword dto) {

        service.changePassword(eno, dto);

        return ResponseFactory
                .success("비밀번호 변경 성공");
    }

    @PostMapping("/api/template-upload/{eno}")
    public ApiResponse<?> templateUpload(@PathVariable Long eno, MultipartFile file){
        String fileName = fileCtrl.templateSave(file, eno);

        return ResponseFactory
                .success(Map.of("FileName", fileName));
    }

    @DeleteMapping("/api/template-delete/{eno}")
    public ApiResponse<?> templateDelete(@PathVariable Long eno){

        fileCtrl.templateDelete(eno);

        return ResponseFactory
                .success("템플릿 삭제 성공");
    }
}