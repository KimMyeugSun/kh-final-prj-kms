package com.kh.team119.healthcheckup.attachment.service;

import com.kh.team119.common.FileController;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.healthcheckup.attachment.dto.RespHealthCheckUpAttachmentLookUp;
import com.kh.team119.healthcheckup.attachment.dto.RespHealthCheckUpAttachmentRegister;
import com.kh.team119.healthcheckup.attachment.dto.RespHealthCheckUpAttachmentUpdate;
import com.kh.team119.healthcheckup.attachment.entity.HealthCheckUpAttachmentEntity;
import com.kh.team119.healthcheckup.attachment.repository.HealthCheckUpAttachmentRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.core.io.Resource;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class HealthCheckUpAttachmentService {
    private final HealthCheckUpAttachmentRepository healthCheckUpAttachmentRepository;
    private final EmployeeRepository employeeRepository;
    private final FileController fileCtrl;

    public RespHealthCheckUpAttachmentRegister register(Long eno, String fileName, String originalFileName) {

        var empEntity = employeeRepository.findByEno(eno);

        if (empEntity == null)
            throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);

        var entity = HealthCheckUpAttachmentEntity.builder()
                .employeeEntity(empEntity)
                .fileName(fileName)
                .originalFileName(originalFileName)
                .build();

        healthCheckUpAttachmentRepository.save(entity);

        return RespHealthCheckUpAttachmentRegister.from(entity);
    }

    public RespHealthCheckUpAttachmentLookUp lookUp(Long eno) {
        var healthCheckUpAttachmentEntities = healthCheckUpAttachmentRepository.findAllByEnoAndDeletedAtIsNull(eno);

        return RespHealthCheckUpAttachmentLookUp.from(healthCheckUpAttachmentEntities);
    }

    public RespHealthCheckUpAttachmentUpdate replaceAttachment(Long eno, Long hcno, String path, String changeFileName, String originalFilename) {

        var targetEntity = healthCheckUpAttachmentRepository.findByEnoAndHcnoAndDeletedAtIsNull(eno, hcno);

        if(targetEntity == null)
            throw new Team119Exception(ErrorCode.NOT_FOUND_HEALTH_CHECKUP_ATTACHMENT);

        fileCtrl.remove(path, targetEntity.getFileName());
        targetEntity.replaceFileName(changeFileName, originalFilename);

        return RespHealthCheckUpAttachmentUpdate.from(targetEntity);
    }

    public void deleteAttachment(Long eno, Long hcno, String path) {
        var target = healthCheckUpAttachmentRepository.deleteByEnoAndHcnoAndDeletedAtIsNull(eno, hcno);

        if(target == null)
            throw new Team119Exception(ErrorCode.NOT_FOUND_HEALTH_CHECKUP_ATTACHMENT);

        fileCtrl.remove(path, target.getFileName());
    }

    public Resource download(Long eno, Long hcno, String path) {

        var target = healthCheckUpAttachmentRepository.findByEnoAndHcnoAndDeletedAtIsNull(eno, hcno);

        if(target == null)
            throw new Team119Exception(ErrorCode.NOT_FOUND_HEALTH_CHECKUP_ATTACHMENT);

        return fileCtrl.download(target.getFileName(), path);
    }
}
