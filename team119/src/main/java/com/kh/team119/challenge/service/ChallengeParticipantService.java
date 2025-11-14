package com.kh.team119.challenge.service;

import com.kh.team119.challenge.dto.request.ChallengeParticipantReqDto;
import com.kh.team119.challenge.dto.response.ChallengeParticipantListRespDto;
import com.kh.team119.challenge.entity.ChallengeEntity;
import com.kh.team119.challenge.entity.ChallengeParticipantEntity;
import com.kh.team119.challenge.repository.ChallengeParticipantRepository;
import com.kh.team119.challenge.repository.ChallengeRepository;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
@Transactional
@RequiredArgsConstructor
public class ChallengeParticipantService {

    private final ChallengeParticipantRepository challengeParticipantRepository;
    private final ChallengeRepository challengeRepository;
    private final EmployeeRepository employeeRepository;

    public void save(ChallengeParticipantReqDto reqDto) {
        // 이전에 참여했던 기록이 있는지 확인
        ChallengeParticipantEntity existing =
                challengeParticipantRepository.findByChallenge_NoAndEmployee_Eno(
                        reqDto.getCno(), reqDto.getEno()
                );
        // 이전 참여 기록이 있는 경우 status 만 업데이트
        if(existing != null) {
            existing.setStatus("ACTIVE");
            existing.setJoinedAt(LocalDateTime.now());
        } else {
            ChallengeEntity cEnity = challengeRepository.findById(reqDto.getCno()).get();
            EmployeeEntity eEntity = employeeRepository.findById(reqDto.getEno()).get();

            ChallengeParticipantEntity entity = ChallengeParticipantEntity.builder()
                    .challenge(cEnity).employee(eEntity).build();

            challengeParticipantRepository.save(entity);
        }
    }

    // chellenge 참여 취소
    public void updateStatus(ChallengeParticipantReqDto reqDto) {
        ChallengeParticipantEntity cpEntity = challengeParticipantRepository.findByChallenge_NoAndEmployee_Eno(reqDto.getCno(), reqDto.getEno());

        if (cpEntity == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_CHALLENGE_PARTICIPANT);
        }

        try {
            cpEntity.setStatus("CANCELLED");
        } catch (Exception e) {
            throw new Team119Exception(ErrorCode.FAILED_TO_UPDATE_PARTICIPANT);
        }
    }

    public Page<ChallengeParticipantListRespDto> findByNo(Long cno, String keyword, Pageable pageable) {
        Page<ChallengeParticipantEntity> page = challengeParticipantRepository.findByNoAndKeyword(cno, keyword, pageable);

        return page.map(ChallengeParticipantListRespDto::from);
    }

    // challenge 상세조회 화면에서 participant status 확인용 메서드 , challenge 컨트롤러에서 호출
    public String getStatusByCnoAndEno(Long cno, Long eno) {
        String status = challengeParticipantRepository.getStatusByCnoAndEno(cno, eno);

        return status;
    }
}
