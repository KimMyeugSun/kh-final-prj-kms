package com.kh.team119.club.board.service;

import com.kh.team119.club.board.dto.board.BoardReqDto;
import com.kh.team119.club.board.dto.board.BoardRespDto;
import com.kh.team119.club.board.entity.BoardEntity;
import com.kh.team119.club.board.entity.LikeEntity;
import com.kh.team119.club.board.entity.ReportEntity;
import com.kh.team119.club.board.enums.Type;
import com.kh.team119.club.board.repository.board.BoardRepository;
import com.kh.team119.club.board.repository.like.LikeRepository;
import com.kh.team119.club.board.repository.report.ReportRepository;
import com.kh.team119.club.category.entity.ClubBoardCategoryEntity;
import com.kh.team119.club.category.repository.ClubBoardCategoryRepository;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.notification.dto.Notification;
import com.kh.team119.notification.dto.NotificationType;
import com.kh.team119.notification.service.NotificationService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class BoardService {
    private final BoardRepository boardRepository;
    private final EmployeeRepository employeeRepository;
    private final ClubBoardCategoryRepository categoryRepository;
    private final LikeRepository likeRepository;
    private final ReportRepository reportRepository;

    private final NotificationService notificationService;

    @Value("${REPORT.LIMIT}")
    private int reportLimit;

    public BoardRespDto.ListRespDto boardLookup(int page, int size, Long cno) {
        Pageable pageable = PageRequest.of(page, size);
        Page<BoardEntity> boardEntities = boardRepository.lookUp(pageable, cno);
        return BoardRespDto.ListRespDto.builder().data(boardEntities
                        .stream().map(BoardRespDto.ListRespDto.ListInnerRespDto::from).toList())
                .totalPages(boardEntities.getTotalPages())
                .total(boardEntities.getTotalElements())
                .currentPage(boardEntities.getNumber())
                .pageSize(boardEntities.getSize())
                .build();
    }

    public void saveBoard(BoardReqDto.saveReqDto reqDto) {
        EmployeeEntity employeeEntity = employeeRepository.findByEno(reqDto.getEno());
        ClubBoardCategoryEntity categoryEntity = categoryRepository.findById(reqDto.getCno()).get();
        BoardEntity boardEntity = reqDto.toEntity(employeeEntity, categoryEntity);
        boardRepository.save(boardEntity);
    }

    public List<BoardRespDto.SearchBoardDto> searchBoard(BoardReqDto.searchReqDto reqDto) {
        List<BoardEntity> findEntityList = boardRepository.findByEntity(reqDto);
        return findEntityList.stream().map(BoardRespDto.SearchBoardDto::from).toList();
    }


    public BoardRespDto.DetailRespDto boardFindByNo(Long no, Long eno) {
        BoardEntity entity = boardRepository.findById(no).get();
        entity.updateHit();
        long likeCnt = likeRepository.countByBoardEntity(entity);
        boolean isLiked = likeRepository.existsByEnoAndBno(eno, entity.getNo());
        long reportCnt = reportRepository.countByBoardEntity(entity);
        if (entity == null) {
            //에러 코드 수정
            throw new Team119Exception(ErrorCode.NOT_FOUND_CLUB_BOARD);
        }
        BoardRespDto.DetailRespDto respDto = BoardRespDto.DetailRespDto.from(entity, isLiked, likeCnt, reportCnt);
        return respDto;
    }

    public void boardLikeToggle(Long no, Long eno) {
        BoardEntity boardEntity = boardRepository.findById(no).get();
        EmployeeEntity employeeEntity = employeeRepository.findByEno(eno);
        LikeEntity likeEntity = LikeEntity.builder()
                .type(Type.B)
                .employeeEntity(employeeEntity)
                .boardEntity(boardEntity)
                .build();
        boolean existedByEntity = likeRepository.existsByEntity(likeEntity);
        if (existedByEntity) {
            likeRepository.deleteByEntity(likeEntity);
        } else {
            likeRepository.save(likeEntity);
        }
    }

    public String boardReport(Long bno, BoardReqDto.reportReqDto reqDto) {
        BoardEntity boardEntity = boardRepository.findById(bno).get();
        EmployeeEntity employeeEntity = employeeRepository.findByEno(reqDto.getEno());
        boolean isReport = reportRepository.existsByBnoAndEno(bno, reqDto.getEno());
        if(isReport){
            return "이미 신고된 게시글 입니다";
        }
        ReportEntity reportEntity = reqDto.toEntity(employeeEntity, boardEntity);
        reportRepository.save(reportEntity);

        Long reportedCount = reportRepository.reportedCount(bno);
        if (reportedCount == reportLimit) {
            Notification notification = Notification.builder()
                    .type(NotificationType.important)
                    .title("게시글 신고")
                    .message(String.format("[%d]번 게시글 신고가 5회 이상 누적되었습니다.\n게시글을 확인해주세요.", bno))
                    .build();

            //!<eno == 0L 관리자에게 알람
            notificationService.pushNotification(notification, 0L);
        }
        return "게시글 신고가 완료되었습니다";
    }

    public BoardEntity boardUserDelect(Long no, BoardReqDto.BoardDelectReqDto delectReqDto) {
        BoardEntity boardEntity = boardRepository.findById(no).get();
        if (delectReqDto.getEno() != boardEntity.getWriter().getEno()) {
            // 에러코드 수정 필요(작성자가 동일하지 않음)
            System.out.println(delectReqDto.getEno() != boardEntity.getWriter().getEno());
            throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);
        }
        boardEntity.boardUserDelect();
        return boardEntity;
    }

    public BoardEntity boardEdit(Long no, BoardReqDto.BoardEditReqDto reqDto) {
        BoardEntity boardEntity = boardRepository.findById(no).get();
        if (reqDto.getEno() != boardEntity.getWriter().getEno()) {
            // 에러코드 수정 필요 (작성자가 동일하지 않음)
            throw new Team119Exception(ErrorCode.NOT_FOUND_ACCOUNT);
        }
        boardEntity.boardEdit(reqDto);
        return boardEntity;
    }
}
