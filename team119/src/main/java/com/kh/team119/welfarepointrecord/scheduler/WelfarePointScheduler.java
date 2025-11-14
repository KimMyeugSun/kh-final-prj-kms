package com.kh.team119.welfarepointrecord.scheduler;


import com.kh.team119.welfarepointrecord.service.WelfarePointRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;


@Component
@RequiredArgsConstructor
@Slf4j
public class WelfarePointScheduler {

    private final WelfarePointRecordService welfarePointRecordService;

    // 매월 1일 복지 포인트 정기 지급
    // @Scheduled(cron = "0 * * * * *")     // 1분마다 실행
    // @Scheduled(cron = "0 0 */12 * * *")  // 12시간마다 실행
    @Scheduled(cron = "0 0 0 1 * *")       // 한달에 한번 실행
    public void distributeMonthlyWelfarePoint() {
        log.info("[WelfarePointScheduler] 매월 1일 정기 지급 시작");
        welfarePointRecordService.distributeMonthlyPoints();
        log.info("[WelfarePointScheduler] 매월 1일 정기 지급 종료");
    }

}
