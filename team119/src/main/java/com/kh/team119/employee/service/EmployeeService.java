package com.kh.team119.employee.service;

import com.kh.team119.authentication.SecurityAuthVo;
import com.kh.team119.authentication.dto.ReqAuthority;
import com.kh.team119.authentication.dto.RespAuthority;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.common.validate.Validate;
import com.kh.team119.department.DepartmentType;
import com.kh.team119.department.entity.DepartmentEntity;
import com.kh.team119.department.repository.DepartmentRepository;
import com.kh.team119.employee.dto.*;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.role.entity.RoleEntity;
import com.kh.team119.roletype.RoleType;
import com.kh.team119.welfarepointrecord.repository.WelfarePointRecordRepository;
import com.querydsl.core.Tuple;
import jakarta.persistence.PersistenceException;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeRepository empRepository;
    private final DepartmentRepository depRepository;
    private final WelfarePointRecordRepository welfarePointRecordRepository;

    private final PasswordEncoder bCryptPasswordEncoder;

    public void signUp(SecurityAuthVo vo, String fileName) {
        //!< biz logic
        validate(vo);

        DepartmentEntity dep = depRepository.findByName(DepartmentType.descOf(vo.getDepartment()));
        vo.setPassword(bCryptPasswordEncoder.encode(vo.getPassword()));
        var empEntity = vo.toEmpEntity(dep, fileName);

        var roles = (vo.getRoles() == null || vo.getRoles().isEmpty())
                ? List.of(RoleType.USER)
                : vo.getRoles();

        for (RoleType r : roles) {
//            RoleTypeEntity roleTypeEntity = roleTypeRepository.findByRoleType(r)
//                    .orElseThrow(() -> new IllegalArgumentException("Unknown role: " + r));

            RoleEntity role = RoleEntity.builder()
                    .roleType(r)
                    .build();

            empEntity.grant(role); //!< 양방향 설정
        }

        if (dep == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_DEPARTMENT);
        }

        try {
            empRepository.save(empEntity);
        } catch (DataIntegrityViolationException | PersistenceException e) {
            // 고유 제약 조건 위반 처리
            throw new Team119Exception(ErrorCode.DUPLICATE_ID);
        }
    }

    void validate(SecurityAuthVo vo) {
        System.out.println(vo);
        if (!Validate.ID(vo.getId())) {
            throw new Team119Exception(ErrorCode.VALIDATE_ID);
        }

        if (!Validate.PASSWORD(vo.getPassword())) {
            throw new Team119Exception(ErrorCode.VALIDATE_PASSWORD);
        }

        if (empRepository.existsByEmpId(vo.getId())) {
            throw new Team119Exception(ErrorCode.DUPLICATE_ID);
        }
    }

    public EmployeeEntity findEntityByEmpId(String id) {
        var result = empRepository.findByEmpId(id);

        if (result == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);
        }

        return result;
    }

    public EmployeeDto findByEmpId(String id) {
        var result = findEntityByEmpId(id);

        if (result == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);
        }

        return EmployeeDto.from(result);
    }

    public RespEmpList lookUp(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<EmployeeEntity> result = null;
        try {
            result = empRepository.lookUp(pageable);
        }catch (Exception e){
            e.printStackTrace();
        }

        return RespEmpList.builder()
                .data(result.stream().map(RespEmpList.EmpVo::from).toList())
                .totalPages(result.getTotalPages())
                .total(result.getTotalElements())
                .currentPage(result.getNumber())
                .pageSize(result.getSize())
                .build();
    }

    public RespEmpLookAt lookAt(Long eno) {
        var result = empRepository.findById(eno);

        if (result.isEmpty()) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);
        }

        return RespEmpLookAt.from(result.get());
    }

    public RespAuthority updateAuthority(ReqAuthority dto) {
        var empEntity = empRepository.findByEno(dto.getEno());

        if (empEntity == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);
        }

        empEntity.getRoles().clear();

        for (RoleType roleType : dto.getRoles()) {
//            RoleTypeEntity roleTypeEntity = roleTypeRepository.findByRoleType(roleType)
//                    .orElseThrow(() -> new IllegalArgumentException("Unknown role: " + roleType));

            RoleEntity newRole = RoleEntity.builder()
                    .roleType(roleType)
                    .build();

            empEntity.grant(newRole);
        }

        return RespAuthority.builder()
                .role(empEntity.getRoles().stream().map(RoleEntity::getRoleType).toList())
                .build();
    }

    public String changeProfile(Long eno, String fileName) {
        var empEntity = empRepository.findByEno(eno);

        if (empEntity == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);
        }

        empEntity.changeProfile(fileName);

        return empEntity.getEmpProfileName();
    }

    public void changePassword(Long eno, ReqChangePassword dto) {
        var empEntity = empRepository.findByEno(eno);

        if (empEntity == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);
        }

        if (!bCryptPasswordEncoder.matches(dto.getPrevPwd(), empEntity.getEmpPwd())) {
            throw new Team119Exception(ErrorCode.MISMATCH_PASSWORD);
        }

        if (!Validate.PASSWORD(dto.getNewPwd())) {
            throw new Team119Exception(ErrorCode.VALIDATE_PASSWORD);
        }

        String encodedPwd = bCryptPasswordEncoder.encode(dto.getNewPwd());
        empEntity.changePassword(encodedPwd);
    }

//    public RespEmpTag getTag(Long eno) {
//        var empEntity = empRepository.findTagsByEno(eno);
//
//        if (empEntity == null) {
//            throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);
//        }
//
//        return RespEmpTag.from(empEntity.getTags());
//    }

    public EmployeeEntity findBasicInfoByEno(Long eno) {
        var empEntity = empRepository.findByEno(eno);

        if(empEntity == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);
        }

        return empEntity;
    }
}