package com.kh.team119.notification.service;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.notification.dto.*;
import com.kh.team119.notification.entity.NotificationEntity;
import com.kh.team119.notification.repository.NotificationRepository;
import com.querydsl.core.Tuple;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.messaging.simp.SimpMessageSendingOperations;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ConcurrentHashMap;

@Service
@Transactional
@RequiredArgsConstructor
public class NotificationService {
    private final EmployeeRepository employeeRepository;
    private final NotificationRepository notificationRepository;

    private final SimpMessageSendingOperations msgSendingOperations;
    private final ConcurrentHashMap<String, Long> sessions = new ConcurrentHashMap<>();

    /**
     * 알림 보내기
     *
     * @param dto Notification - 알림 내용
     * @param eno Long - 사원번호
     */
    public void pushNotification(Notification dto, Long eno) {
        var empEntity = employeeRepository.findByEno(eno);
        var entity = dto.toEntity(empEntity);

        notificationRepository.save(entity);
        var packet = NotificationPacket.from(entity);

        sendNotification(packet, eno);
    }

    public void getUnprocessedNotification(Long eno) {
        var result = notificationRepository.findByEno(eno);

        sendNotification(result
                .stream()
                .map(NotificationPacket::from)
                .toList(), eno);
    }

    public void done(ReqNotificationDone dto) {
        if (notificationRepository.existsNotificationAndIsReadFalse(dto.getNno(), dto.getEno())) {
            notificationRepository.done(dto.getNno(), dto.getEno());
        }
    }

    public void connect(String sessionId, long eno) {
        sessions.put(sessionId, eno);
    }

    public void disconnect(String sessionId) {
        sessions.remove(sessionId);
    }

    private void sendNotification(Object packet, long eno) {
        msgSendingOperations.convertAndSend(String.format("/sub/notification/%d", eno), packet);
    }

    private void sendWelfarePoint(WelfarePointPacket packet, long eno) {
        msgSendingOperations.convertAndSend(String.format("/sub/welfare-point/%d", eno), packet);
    }

    public void distributeMonthlyNotification(String title, String msg, List<Tuple> tuples) {

        for (Tuple tp : tuples) {
            Long eno = tp.get(0, Long.class);
            Long welfarePoints = tp.get(1, Long.class);

            sendNotification(NotificationPacket.builder()
                    .title(title)
                    .message(msg)
                    .notificationType(NotificationType.normal)
                    .build(), eno);

            sendWelfarePoint(WelfarePointPacket.builder()
                    .eno(eno)
                    .welfarePoints(welfarePoints)
                    .build(), eno);
        }
    }

    public void broadcast(Notification dto) {
        var notificationEntities = notificationRepository.insertAlarmByAllEmployee(dto);

        for (NotificationEntity entity : notificationEntities) {
            var packet = NotificationPacket.from(entity);
            sendNotification(packet, entity.getEmployeeEntity().getEno());
        }
    }
}
