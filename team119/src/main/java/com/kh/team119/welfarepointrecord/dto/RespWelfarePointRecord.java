package com.kh.team119.welfarepointrecord.dto;

import com.kh.team119.welfarepointrecord.OccurrenceType;
import com.kh.team119.welfarepointrecord.entity.WelfarePointRecordEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import org.springframework.data.domain.Page;

import java.time.LocalDateTime;
import java.util.List;

@Getter
@Setter
@Builder
public class RespWelfarePointRecord {
    private int totalPages;         //!< 전체 페이지 수
    private Long total;             //!< 전체 수
    private int currentPage;        //!< 현재 페이지
    private int pageSize;           //!< 한 페이지에 보여줄 데이터 수

    private List<WelfarePointRecord> records;

    @Getter
    @Setter
    @Builder
    public static class WelfarePointRecord {
        private Long no;
        private Long afterValue;
        private Long beforeValue;
        private Long amount;

        private String strOccurrenceType;
        private LocalDateTime occurrenceAt;

        private String description;

        public static WelfarePointRecord from(WelfarePointRecordEntity entity) {
            return WelfarePointRecord.builder()
                    .no(entity.getNo())
                    .afterValue(entity.getAfterValue())
                    .beforeValue(entity.getBeforeValue())
                    .amount(entity.getAmount())
                    .strOccurrenceType(entity.getOccurrenceType().getDesc())
                    .occurrenceAt(entity.getOccurrenceAt())
                    .description(entity.getDescription())
                    .build();
        }
    }

    public static RespWelfarePointRecord from(Page<WelfarePointRecordEntity> records) {
        return RespWelfarePointRecord.builder()
                .totalPages(records.getTotalPages())
                .total(records.getTotalElements())
                .currentPage(records.getNumber())
                .pageSize(records.getSize())
                .records(records.getContent().stream()
                        .map(WelfarePointRecord::from)
                        .toList())
                .build();
    }
}
