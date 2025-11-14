package com.kh.team119.tag.service;

import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.tag.TagType;
import com.kh.team119.tag.dto.RespTagLookUp;
import com.kh.team119.tag.entity.EmpTagEntity;
import com.kh.team119.tag.repository.EmpTagRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class EmpTagService {
    private final EmployeeRepository employeeRepository;
    private final EmpTagRepository empTagRepository;

    private void entry(TagType tag, Long eno) {
        if(!empTagRepository.existsByTagAndEno(tag, eno)) {
            var empEntity = employeeRepository.findByEno(eno);
            var entity = EmpTagEntity.builder()
                            .tag(tag)
                            .employeeEntity(empEntity)
                            .build();

            empTagRepository.save(entity);
        }
    }

    private void remove(TagType tag, Long eno) {
        if(empTagRepository.existsByTagAndEno(tag, eno)) {
            empTagRepository.delete(tag, eno);
        }
    }

    public RespTagLookUp getEmpTag(Long eno) {
        var result = empTagRepository.findByEno(eno);

        return RespTagLookUp.builder()
                .tags(result.stream().map(EmpTagEntity::getTag).map(TagType::getDesc).toList())
                .build();
    }
}
