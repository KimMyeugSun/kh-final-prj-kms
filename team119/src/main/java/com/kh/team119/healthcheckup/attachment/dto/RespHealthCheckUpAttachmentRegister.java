package com.kh.team119.healthcheckup.attachment.dto;

import com.kh.team119.healthcheckup.attachment.entity.HealthCheckUpAttachmentEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class RespHealthCheckUpAttachmentRegister {
    private Long hcno;
    private LocalDateTime registeredAt;
    private LocalDateTime updatedAt;
    private String fileName;
    private String originFileName;

    public static RespHealthCheckUpAttachmentRegister from(HealthCheckUpAttachmentEntity entity) {
        return RespHealthCheckUpAttachmentRegister.builder()
                .hcno(entity.getHcno())
                .registeredAt(entity.getRegisteredAt())
                .updatedAt(entity.getUpdatedAt())
                .fileName(entity.getFileName())
                .originFileName(entity.getOriginalFileName())
                .build();
    }
}
