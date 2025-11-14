package com.kh.team119.rank.service;

import com.kh.team119.challenge.entity.ChallengeEntity;
import com.kh.team119.challenge.repository.ChallengeCertRecordRepository;
import com.kh.team119.challenge.repository.ChallengeRepository;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.employee.repository.EmployeeRepositoryDSL;
import com.kh.team119.rank.dto.RankDto;
import com.kh.team119.rank.dto.RankRespDto;
import com.kh.team119.rank.entity.RankEntity;
import com.kh.team119.rank.entity.RankingPeriodEntity;
import com.kh.team119.rank.repository.RankPeriodRepository;
import com.kh.team119.rank.repository.RankRepository;
import com.kh.team119.welfarepointrecord.OccurrenceType;
import com.kh.team119.welfarepointrecord.service.WelfarePointRecordService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.ArrayList;
import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
@Slf4j
public class RankService {

    private final ChallengeCertRecordRepository certRecordRepository;
    private final RankRepository rankRepository;
    private final EmployeeRepository employeeRepository;
    private final WelfarePointRecordService welfarePointRecordService;
    private final RankPeriodRepository rankPeriodRepository;
    private final ChallengeRepository challengeRepository;

    public List<RankDto> getApprovedChallengeScores() {
        return certRecordRepository.findScores();
    }

    
    // @Scheduled(cron = "0 */5 * * * *")   // 5분마다 실행
    // @Scheduled(cron = "0 0 0 */3 * *")   // 3일에 한번 실행
    @Scheduled(cron = "0 0 0 1 * *")        // 한달에 한번 실행
    public void calcRank() {
        log.info("===== [WelfarePointScheduler] 랭킹 집계 시작 =====");

        // 활성화된 챌린지 no 확인
        ChallengeEntity activeChallenge = challengeRepository.findByStatus("ACTIVE");
        if(activeChallenge == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_CHALLENGE);
        }
        Long cno = activeChallenge.getNo();
        log.info("[RankService] 현재 챌린지 cno={}", cno);

        // 이번 달 코드 생성 (예: "2025-09")
        YearMonth currentYm = YearMonth.now();
        String rankingName = currentYm.format(DateTimeFormatter.ofPattern("yyyy-MM"));

        // 이번 달 Period 엔티티 생성
        RankingPeriodEntity rankingPeriod = rankPeriodRepository.save(
                RankingPeriodEntity.builder()
                        .rankingName(rankingName)
                        .cno(cno)
                        .build()
        );

        // 인증 성공 기록 조회 (eno, totalScore)
        //List<RankDto> scores = getApprovedChallengeScores();
        List<RankDto> scores = certRecordRepository.findScoresByCno(cno);
        if (scores.isEmpty()) {
            log.info("[RankService] 해당 챌린지({}) 인증 데이터 없음", cno);
            return;
        }

        for(RankDto dto : scores) {

            // 해당 직원의 랭킹 데이터가 존재하는지 조회
            RankEntity rankEntity = rankRepository.findByEmployeeEno(dto.getEno());
            if(rankEntity == null) {
                // 랭킹 데이터가 없어서 새로 만들어야 할 때 이 직원이 실제 존재하는지 확인 후 랭킹 엔티티와 연결
                EmployeeEntity employeeEntity = employeeRepository.findByEno(dto.getEno());
                if(employeeEntity == null) {
                    throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);
                }

                rankEntity = RankEntity.builder().employee(employeeEntity).rankingPeriod(rankingPeriod).build();
            }
            // 점수 갱신
            rankEntity.updateScore(dto.getTotalScore());

            // 랭킹 저장
            try {
                rankRepository.save(rankEntity);
            } catch (Exception e) {
                throw new Team119Exception(ErrorCode.FAILED_TO_SAVE_RANKING);
            }
        }
        log.info("===== [WelfarePointScheduler] 랭킹별 복지 포인트 지급 시작 =====");
        distributeRankRewardsByCno(cno);
        
    }

    // 랭킹 순위 별 복지포인트 지급
    public void distributeRankRewardsByCno(Long cno) {
        List<RankEntity> rankEntityList = rankRepository.findAllByRankingPeriod_CnoOrderByScoreDesc(cno);

        int rank = 0;               // 현재 순위
        int sameRankCount = 0;      // 공동 순위 인원 카운트
        Long prevScore = null;      // 이전 점수

        for(RankEntity entity : rankEntityList) {

            // 순위 계산 (공동 순위 반영)
            if (prevScore == null || !prevScore.equals(entity.getScore())) {
                rank = rank + sameRankCount + 1; // 다음 순위로 점프
                sameRankCount = 0;
            } else {
                sameRankCount++; // 공동 순위
            }
            prevScore = entity.getScore();


            long eno = entity.getEmployee().getEno();
            long reward = getRewardByRank(rank);

            String description = String.format("랭킹 %d위 보상 지급 %d 포인트", rank, reward);

            try {
                welfarePointRecordService.registerWelfarePointRecord(eno, reward, OccurrenceType.RANK, description);
            } catch(Exception e) {
                throw new Team119Exception(ErrorCode.FAILED_TO_DISTRIBUTE_REWARD);
            }
            log.info("[RankReward] {}({}) → {}위, 보상 {} 지급",
                    entity.getEmployee().getEmpName(), eno, rank, reward);

        }
    }

    // 순위별 포인트 산정 규칙
    private long getRewardByRank(int rank) {
        if (rank == 1) return 100_000L;
        if (rank <= 3) return 50_000L;
        if (rank <= 10) return 30_000L;
        return 0L;
    }

    // 랭킹 조회
    public List<RankRespDto> findAll() {
        List<RankEntity> rankEntityList = rankRepository.findAllWithEmployeeOrderByScoreDesc();
        List<RankRespDto> respDtoList = new ArrayList<>();

        int rank = 0;        // 현재 순위
        int sameRankCount = 0; // 공동 순위 인원 카운트
        Long prevScore = null;

        for(RankEntity entity : rankEntityList) {

            // 순위 계산 (공동 순위 반영)
            if (prevScore == null || !prevScore.equals(entity.getScore())) {
                rank = rank + sameRankCount + 1;
                sameRankCount = 0;
            } else {
                sameRankCount++;
            }

            prevScore = entity.getScore();

            RankRespDto respDto = new RankRespDto();
            respDto.setEno(entity.getEmployee().getEno());
            respDto.setEmpId(entity.getEmployee().getEmpId());
            respDto.setEmpName(entity.getEmployee().getEmpName());
            respDto.setScore(entity.getScore());
            respDto.setRank(rank);

            // 순위별 배지 및 지급 포인트 설정
            if (rank == 1) {
                respDto.setBadge("Gold");
                respDto.setAmount(100000L);
            } else if (rank <= 3) {
                respDto.setBadge("Silver");
                respDto.setAmount(50000L);
            } else if (rank <= 10) {
                respDto.setBadge("Bronze");
                respDto.setAmount(30000L);
            } else {
                respDto.setBadge("Iron");
                respDto.setAmount(0L);
            }

            respDtoList.add(respDto);
        }

        return respDtoList;
    }
}
