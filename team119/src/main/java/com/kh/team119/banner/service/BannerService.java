package com.kh.team119.banner.service;

import com.kh.team119.banner.dto.RespBanner;
import com.kh.team119.challenge.repository.ChallengeRepository;
import com.kh.team119.common.FileController;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.healthBoard.entity.HealthBoardEntity;
import com.kh.team119.healthBoard.repository.HealthBoardRepository;
import com.kh.team119.mall.product.repository.ProductRepository;
import com.kh.team119.tag.TagType;
import com.kh.team119.tag.entity.EmpTagEntity;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ThreadLocalRandom;

@Service
@Transactional
@RequiredArgsConstructor
public class BannerService {

    private final EmployeeRepository employeeRepository;
    private final ChallengeRepository challengeRepository;
    private final ProductRepository productRepository;
    private final HealthBoardRepository healthBoardRepository;
    private final FileController fileCtrl;

    @Value("${CHALLENGE_STORAGE_PATH.IMG}")
    private String challengeUploadPath;
    @Value("${PRODUCT_STORAGE_PATH.IMG}")
    private String productUploadPath;
    @Value("${HEALTH_BOARD.STORAGE_PATH.IMG}")
    private String healthBoardUploadPath;

    public List<RespBanner> getBanners(Long eno) {
        var ret = new ArrayList<RespBanner>();
        var empEntity = employeeRepository.findByEno(eno);

        if (empEntity == null)
            throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);

        // /challenge/:id
        var tags = empEntity.getTags().stream().map(EmpTagEntity::getTag).toList();
        //!< 태그가 없으면 빈 리스트 반환
//        if (!tags.isEmpty()) {

        var supplements = productRandomPickOne("영양제");
        if (supplements != null) ret.add(supplements);

        var sportsEquipment = productRandomPickOne("운동용품");
        if (sportsEquipment != null) ret.add(sportsEquipment);

        var snack = productRandomPickOne("간식");
        if (snack != null) ret.add(snack);

//=======================================================================================================================
//*tag에 해당하는 (보조제, 음식, 운동 등등) 배너 등록 로직 필요*//
//=======================================================================================================================
//        tag에 해당하는 healthBoard 배너출력
        RespBanner healthBoard = ByTagPickList(tags);
        if (healthBoard != null) ret.add(healthBoard);
//=======================================================================================================================
//* 활성화된 챌린지 1개(selectOne) 배너 출력 *//
//=======================================================================================================================
        var actChallengeEntity = challengeRepository.findStatusIsActive();
        if (actChallengeEntity != null) {
            ret.add(
                    fileCtrl
                            .bannerUrl(
                                    challengeUploadPath,
                                    actChallengeEntity.getUrl(),
                                    String.format("/challenge/%d", actChallengeEntity.getNo()))
            );
        }
//=======================================================================================================================
        return ret;
    }

    private RespBanner productRandomPickOne(String category) {
        var finds = productRepository.findByCategory(category);
        if (finds == null || finds.isEmpty()) return null;
        var pickOne = productRandomPickOne(finds);
        if (pickOne == null) return null;

        return fileCtrl
                .bannerUrl(
                        productUploadPath,
                        pickOne.getUrl(),
                        String.format("/mall/%d", pickOne.getNo()));


    }

    private static <T> T productRandomPickOne(List<T> list) {
        if (list == null || list.isEmpty()) return null;
        int idx = ThreadLocalRandom.current().nextInt(list.size());
        return list.get(idx);
    }

    // 유저의 태그에 맞는 리스트 출력을 위한 메서드(healthBoard)
    private RespBanner ByTagPickList(List<TagType> tags) {
        if (tags == null || tags.isEmpty()) return null;
        var finds = healthBoardRepository.findByTagIn(tags);
        if (finds == null || finds.isEmpty() || finds.equals("{}")) return null;
        var pickOne = productRandomPickOne(finds);
        if (pickOne == null) return null;

        return fileCtrl
                .bannerUrl(
                        String.format(healthBoardUploadPath, pickOne.getBno()),
                        pickOne.getImgUrl().get(0),
                        String.format("/healthBoard/%d", pickOne.getBno()));

    }


}

