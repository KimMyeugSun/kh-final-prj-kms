package com.kh.team119.club.category.service;

import com.kh.team119.club.category.dto.ClubBoardCategoryReqDto;
import com.kh.team119.club.category.dto.ClubBoardCategoryRespDto;
import com.kh.team119.club.category.dto.ManageClubBoardReqDto;
import com.kh.team119.club.category.dto.ManageClubBoardRespDto;
import com.kh.team119.club.category.entity.ClubBoardCategoryEntity;
import com.kh.team119.club.category.enums.Allowed;
import com.kh.team119.club.category.repository.ClubBoardCategoryRepository;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.notification.dto.Notification;
import com.kh.team119.notification.dto.NotificationType;
import com.kh.team119.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.aspectj.weaver.ast.Not;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class ClubBoardService {

    private final ClubBoardCategoryRepository categoryRepository;
    private final EmployeeRepository employeeRepository;
    private final NotificationService notificationService;

    public ClubBoardCategoryEntity findByName(String name){
        return categoryRepository.findByName(name);
    }

    public ClubBoardCategoryRespDto.ListRespDto findByIsAllowed(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ClubBoardCategoryEntity> entityList = categoryRepository.findByIsAllowed(pageable);
        if (entityList == null){
            throw new Team119Exception(ErrorCode.NOT_FOUND_CLUB_BOARD);
        }
        return ClubBoardCategoryRespDto.ListRespDto.builder()
                .data(entityList.stream().map(ClubBoardCategoryRespDto.ListRespDto.ListInnerRespDto::from).toList())
                .totalPages(entityList.getTotalPages())
                .total(entityList.getTotalElements())
                .currentPage(entityList.getNumber())
                .pageSize(entityList.getSize())
                .build();
    }

    public List<ClubBoardCategoryRespDto.CreateSearchRespDto> findByNameAndIsAllowed(ClubBoardCategoryReqDto reqDto) {
        if (reqDto == null || reqDto.getName().isEmpty()){
            List<ClubBoardCategoryEntity> allEntityList = categoryRepository.findByAllowed(Allowed.N);
            return allEntityList.stream().map(ClubBoardCategoryRespDto.CreateSearchRespDto::from).toList();
        }else{
            List<ClubBoardCategoryEntity> findEntityList = categoryRepository.findByNameAndAllowd(reqDto.getName());
            return findEntityList.stream().map(ClubBoardCategoryRespDto.CreateSearchRespDto::from).toList();
        }
    }

    public void updateCategory(ClubBoardCategoryReqDto.updateReqDto updateReqDto) {
        EmployeeEntity leader = employeeRepository.findById(updateReqDto.getEno()).get();
        ClubBoardCategoryEntity entity = categoryRepository.findById(updateReqDto.getNo()).get();
        entity.assignLeader(leader);
        entity.changePurpose(updateReqDto.getPurpose());
        entity.userApproved();
        entity.updateDate();
    }

    public Object reqLookUp(int page, int size) {
        Pageable pageable = PageRequest.of(page, size);
        Page<ClubBoardCategoryEntity> entityList = categoryRepository.reqLookUp(pageable);
        return ManageClubBoardRespDto.ListRespDto.builder()
                .data(entityList.stream().map(ManageClubBoardRespDto.ListRespDto.ListInnerRespDto::from).toList())
                .totalPages(entityList.getTotalPages())
                .total(entityList.getTotalElements())
                .currentPage(entityList.getNumber())
                .pageSize(entityList.getSize())
                .build();
    }

    public ManageClubBoardRespDto.DetailRespDto reqLookAt(Long no) {
        ClubBoardCategoryEntity categoryEntity = categoryRepository.findById(no).get();
        return ManageClubBoardRespDto.DetailRespDto.builder()
                .eno(categoryEntity.getLeader().getEno())
                .leaderName(categoryEntity.getLeader().getEmpName())
                .purpose(categoryEntity.getPurpose())
                .no(categoryEntity.getNo())
                .name(categoryEntity.getName())
                .updatedAt(categoryEntity.getUpdateAt())
                .build();
    }

    public void reqRejectOrApprove(Long no, ManageClubBoardReqDto.ReqRejectOrApproveDto action) {
        ClubBoardCategoryEntity categoryEntity = categoryRepository.findById(no).get();
        Long eno = categoryEntity.getLeader().getEno();

        if (action.getAction().equals("approve")){
            categoryEntity.adminApprove();

            // 알림 전송
            Notification dto = Notification.builder()
                    .type(NotificationType.normal)
                    .title("동호회 창설 신청 결과")
                    .message("신청하신 동호회 창설 신청이 승인되었습니다.")
                    .build();

            notificationService.pushNotification(dto, eno);

        } else if (action.getAction().equals("reject")) {
            categoryEntity.reject();

            // 알림 전송
            Notification dto = Notification.builder()
                    .type(NotificationType.important)
                    .title("동호회 창설 신청 결과")
                    .message("신청하신 동호회 창설 신청이 반려되었습니다.")
                    .build();

            notificationService.pushNotification(dto, eno);
        }
    }
}
