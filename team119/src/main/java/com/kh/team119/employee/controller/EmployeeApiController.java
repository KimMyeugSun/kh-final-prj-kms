package com.kh.team119.employee.controller;
import com.kh.team119.common.FileController;
import com.kh.team119.common.api.response.ApiResponse;
import com.kh.team119.common.api.response.ResponseFactory;
import com.kh.team119.employee.dto.RespEmpList;
import com.kh.team119.employee.dto.RespEmpLookAt;
import com.kh.team119.employee.dto.RespEmpTag;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.service.EmployeeService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequiredArgsConstructor
@RequestMapping(path={"/api/employee", "/management/api/employee"})
public class EmployeeApiController {
    private final EmployeeService service;
    private final FileController fileCtrl;

    @Value("${PROFILE_STORAGE_PATH.IMG}")
    private String profileStoragePath;

    @GetMapping("/look-up/{page}")
    public ApiResponse<RespEmpList> lookUp(@PathVariable int page) {
        int pageLimit = 10;

        //!< PageRequest 0부터 시작 pathvariable 1부터 시작 -> page - 1
        var result = service.lookUp(page - 1, pageLimit);

        return ResponseFactory
                .success(result);
    }

    @GetMapping("/look-at/{eno}")
    public ApiResponse<RespEmpLookAt> lookAt(@PathVariable Long eno) {
        var result = service.lookAt(eno);

        return ResponseFactory
                .success(result);
    }

    @PostMapping("/profile/{eno}")
    public ApiResponse<Map<String, Object>> changeProfile(@PathVariable Long eno, @RequestParam MultipartFile profile) {

        String fileName = null;

        if(profile != null)
            fileName = fileCtrl.save(profile, profileStoragePath);

        var profileName = service.changeProfile(eno, fileName);

        return ResponseFactory
                .success(Map.of("empProfileName", profileName));
    }

//    @GetMapping("/tag/{eno}")
//    public ApiResponse<RespEmpTag> getTag(@PathVariable Long eno) {
//         var result = service.getTag(eno);
//
//         return ResponseFactory
//                 .success(result);
//    }


    @GetMapping("/{eno}/cert-info")
    public ApiResponse<Map<String, String>> selectParticipantInfo(@PathVariable Long eno) {
        var entity = service.findBasicInfoByEno(eno);

        Map<String, String> info = new HashMap<>();
        info.put("empId", entity.getEmpId());
        info.put("empName", entity.getEmpName());

        return ResponseFactory.success(info);
    }
}
