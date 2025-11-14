package com.kh.team119.healthcheckup.attachment.dto;

import com.kh.team119.healthcheckup.attachment.entity.HealthCheckUpAttachmentEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;

@Getter
@Setter
@Builder
public class RespHealthCheckUpAttachmentUpdate {
    private Long hcno;
    private LocalDateTime registeredAt;
    private LocalDateTime updatedAt;
    private String originFileName;

    public static RespHealthCheckUpAttachmentUpdate from(HealthCheckUpAttachmentEntity entity){
        return RespHealthCheckUpAttachmentUpdate.builder()
                .hcno(entity.getHcno())
                .registeredAt(entity.getRegisteredAt())
                .updatedAt(entity.getUpdatedAt())
                .originFileName(entity.getOriginalFileName())
                .build();
    }
}
