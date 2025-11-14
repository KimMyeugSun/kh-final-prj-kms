package com.kh.team119.challenge.service;

import com.kh.team119.challenge.dto.request.ChallengeReqDto;
import com.kh.team119.challenge.dto.response.ChallengeRespDto;
import com.kh.team119.challenge.entity.ChallengeEntity;
import com.kh.team119.challenge.repository.ChallengeRepository;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ChallengeService {

    private final ChallengeRepository challengeRepository;

    public void save(ChallengeReqDto reqDto) {
        try {
            ChallengeEntity entity = reqDto.toEntity();
            challengeRepository.save(entity);
        } catch (Exception e) {
            throw new Team119Exception(ErrorCode.FAILED_TO_SAVE_CHALLENGE);
        }

    }

    public ChallengeRespDto findById(Long no) {
        ChallengeEntity entity = challengeRepository.findByNoAndDeletedAtIsNull(no);
        if (entity == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_CHALLENGE);
        }

        ChallengeRespDto respDto = ChallengeRespDto.from(entity);

        return respDto;
    }

    public List<ChallengeRespDto> findAll(Pageable pageable) {
        Page<ChallengeEntity> challengeEntityList = challengeRepository.findAllByDeletedAtIsNull(pageable);

        return challengeEntityList.stream().map(ChallengeRespDto::from).toList();
    }

    public void delete(Long no) {
        ChallengeEntity entity = challengeRepository.findById(no).get();
        if (entity == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_CHALLENGE);
        }
        try {
            entity.delete();
        } catch (Exception e) {
            throw new Team119Exception(ErrorCode.FAILED_TO_DELETE_CHALLENGE);
        }
    }

    public ChallengeRespDto update(ChallengeReqDto reqDto, Long no) {
        ChallengeEntity entity = challengeRepository.findById(no).get();

        if (entity == null) {
            throw new Team119Exception(ErrorCode.NOT_FOUND_CHALLENGE);
        }

        try {
            entity.update(reqDto);
        } catch (Exception e) {
            throw new Team119Exception(ErrorCode.FAILED_TO_UPDATE_CHALLENGE);
        }

        return ChallengeRespDto.from(entity);
    }
}
