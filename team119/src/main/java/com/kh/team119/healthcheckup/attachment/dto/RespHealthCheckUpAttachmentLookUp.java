package com.kh.team119.healthcheckup.attachment.dto;

import com.kh.team119.healthcheckup.attachment.entity.HealthCheckUpAttachmentEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class RespHealthCheckUpAttachmentLookUp {
    private List<item> Data;

    @Getter
    @Setter
    @Builder
    public static class item {
        private Long hcno;
        private LocalDateTime registeredAt;
        private LocalDateTime updatedAt;
        private String fileName;
        private String originFileName;

        public static item from(HealthCheckUpAttachmentEntity entity) {
            return item.builder()
                    .hcno(entity.getHcno())
                    .registeredAt(entity.getRegisteredAt())
                    .updatedAt(entity.getUpdatedAt())
                    .fileName(entity.getFileName())
                    .originFileName(entity.getOriginalFileName())
                    .build();
        }
    }

    public static RespHealthCheckUpAttachmentLookUp from(List<HealthCheckUpAttachmentEntity> entities) {
        return RespHealthCheckUpAttachmentLookUp.builder()
                .Data(entities.stream().map(item::from).toList())
                .build();
    }
}
