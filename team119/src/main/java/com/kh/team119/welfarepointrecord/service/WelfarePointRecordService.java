package com.kh.team119.welfarepointrecord.service;

import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.notification.controller.NotificationController;
import com.kh.team119.notification.dto.Notification;
import com.kh.team119.notification.dto.NotificationPacket;
import com.kh.team119.notification.dto.NotificationType;
import com.kh.team119.notification.entity.NotificationEntity;
import com.kh.team119.notification.repository.NotificationRepository;
import com.kh.team119.notification.service.NotificationService;
import com.kh.team119.welfarepointrecord.dto.RespWelfarePointRecord;
import com.kh.team119.welfarepointrecord.OccurrenceType;
import com.kh.team119.welfarepointrecord.entity.WelfarePointRecordEntity;
import com.kh.team119.welfarepointrecord.repository.WelfarePointRecordRepository;
import com.kh.team119.welfarepointrecord.vo.RecordVo;
import com.querydsl.core.Tuple;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.List;


@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class WelfarePointRecordService {
    private final EmployeeRepository employeeRepository;
    private final WelfarePointRecordRepository welfarePointRecordRepository;
    private final NotificationService notificationService;
    private final NotificationRepository notificationRepository;

    public RespWelfarePointRecord getWelfarePointRecord(Long eno, String keyword, Pageable pageable) {
        Page<WelfarePointRecordEntity> page = welfarePointRecordRepository.findByWprEmpNo(eno, keyword, pageable);

        return RespWelfarePointRecord.from(page);
    }

    public void registerWelfarePointRecord(Long eno, Long amount, OccurrenceType occurrenceType, String description) {
        var empEntity = employeeRepository.findByEno(eno);

        if (empEntity == null)
            throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);

        var currentPoints = empEntity.getWelfarePoints() == null ? 0L : empEntity.getWelfarePoints();
        var newPoints = currentPoints + amount;
        if(newPoints < 0) {
            throw new Team119Exception(ErrorCode.INSUFFICIENT_WELFARE_POINTS);
        }

        empEntity.addWelfarePoints(amount);

        try {
            registerWelfarePointRecord(RecordVo.builder()
                    .employeeEntity(empEntity)
                    .occurrenceType(occurrenceType)
                    .amount(amount)
                    .before(currentPoints)
                    .after(currentPoints + amount)
                    .description(description)
                    .build());

            String formattedAmount = String.format("%,dP", amount);

            // 알람 전송
            Notification dto = Notification.builder()
                    .type(NotificationType.normal)
                    .title("복지포인트")
                    .message(String.format("[%s] 복지 포인트가 변경되었습니다. (%s)", occurrenceType.getDesc(), formattedAmount))
                    .build();

            notificationService.pushNotification(dto, eno);

        } catch (Exception e) {
            throw new Team119Exception(ErrorCode.FAILED_TO_SAVE_WELFARE_POINT);
        }

    }

    public void registerWelfarePointRecord(RecordVo recordVo) {
        welfarePointRecordRepository.save(recordVo.toEntity());
    }

    public void distributeMonthlyPoints() {
        long amount = 100_000L;
        String desc = String.format("매월 1일 정기 지급 %d 포인트", amount);
        String occType = OccurrenceType.REGULAR.name();

        // 복지포인트 벌크 INSERT & 벌크 UPDATE
        int inserted = welfarePointRecordRepository.bulkInsertMonthlyWelfarePoints(amount, occType, desc);
        int updated = employeeRepository.bulkAddWelfarePoints(amount);

        // 알람 전송
        String formattedAmount = String.format("%,dP", amount);
        String message = String.format("[정기지급] 복지 포인트가 지급되었습니다. (%s)", formattedAmount);
        String title = "복지포인트";

        // 알람 벌크 INSERT
        int noticeInserted = notificationRepository.bulkInsertMonthlyNotification(message, NotificationType.normal.name(), title);
        List<Tuple> tuples = employeeRepository.findTargetEno();

        notificationService.distributeMonthlyNotification(title, message, tuples);

        log.info("[WelfarePointScheduler] 복지포인트 지급 완료 - 기록 {}, 포인트 갱신 {}, 알림 {}건",
                inserted, updated, noticeInserted);
    }
}
