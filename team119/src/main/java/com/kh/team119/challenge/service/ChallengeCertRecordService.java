package com.kh.team119.challenge.service;


import com.kh.team119.challenge.dto.request.ChallengeCertRecordReqDto;
import com.kh.team119.challenge.dto.response.ChallengeCertRecordRespDto;
import com.kh.team119.challenge.entity.ChallengeCertRecordEntity;
import com.kh.team119.challenge.entity.ChallengeParticipantEntity;
import com.kh.team119.challenge.repository.ChallengeCertRecordRepository;
import com.kh.team119.challenge.repository.ChallengeParticipantRepository;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;

import java.util.List;
import java.util.Optional;

@Service
@Transactional
@RequiredArgsConstructor
public class ChallengeCertRecordService {

    private final ChallengeCertRecordRepository challengeCertRecordRepository;
    private final ChallengeParticipantRepository challengeParticipantRepository;

    public Long save(ChallengeCertRecordReqDto reqDto) {
        // 참가자 조회
        ChallengeParticipantEntity participant = challengeParticipantRepository.findByChallenge_NoAndEmployee_Eno(reqDto.getCno(), reqDto.getEno());

        if (participant == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_CHALLENGE_PARTICIPANT);
        }

        ChallengeCertRecordEntity entity = reqDto.toEntity(participant);

        try {
            ChallengeCertRecordEntity saved = challengeCertRecordRepository.save(entity);
            return saved.getNo();
        } catch (Exception e){
            throw new Team119Exception(ErrorCode.FAILED_TO_SAVE_CERT_RECORD);
        }
    }

    public List<ChallengeCertRecordRespDto> getMyCertRecords(Long cno, Long eno) {
        List<ChallengeCertRecordEntity> entityList = challengeCertRecordRepository.findMyCertRecords(cno, eno);

        return entityList.stream().map(ChallengeCertRecordRespDto::from).toList();
    }

    public ChallengeCertRecordRespDto findById(Long no) {
        ChallengeCertRecordEntity entity = challengeCertRecordRepository.findById(no).get();

        if(entity == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_CERT_RECORD);
        }

        ChallengeCertRecordRespDto respDto = ChallengeCertRecordRespDto.from(entity);

        return respDto;
    }

    public void delete(Long no) {
        ChallengeCertRecordEntity entity = challengeCertRecordRepository.findById(no).get();

        if(entity == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_CERT_RECORD);
        }

        try {
            entity.delete();
        } catch (Exception e) {
            throw new Team119Exception(ErrorCode.FAILED_TO_DELETE_CERT_RECORD);
        }
    }

    public ChallengeCertRecordRespDto update(ChallengeCertRecordReqDto reqDto, Long no) {
        ChallengeCertRecordEntity entity = challengeCertRecordRepository.findById(no).get();

        if(entity == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_CERT_RECORD);
        }

        try {
            entity.update(reqDto);

            return ChallengeCertRecordRespDto.from(entity);

        } catch (Exception e) {
            throw new Team119Exception(ErrorCode.FAILED_TO_UPDATE_CERT_RECORD);
        }
    }

    public void updateIsApproved(Long no) {
        ChallengeCertRecordEntity entity = challengeCertRecordRepository.findById(no).get();

        String currentIsApproved = entity.getIsApproved();
        entity.updateIsApproved(currentIsApproved);
    }

}
