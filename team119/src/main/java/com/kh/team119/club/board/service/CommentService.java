package com.kh.team119.club.board.service;

import com.kh.team119.club.board.dto.board.BoardReqDto;
import com.kh.team119.club.board.dto.board.BoardRespDto;
import com.kh.team119.club.board.dto.comment.CommentReqDto;
import com.kh.team119.club.board.dto.comment.CommentRespDto;
import com.kh.team119.club.board.entity.BoardEntity;
import com.kh.team119.club.board.entity.CommentEntity;
import com.kh.team119.club.board.entity.LikeEntity;
import com.kh.team119.club.board.entity.ReportEntity;
import com.kh.team119.club.board.enums.Type;
import com.kh.team119.club.board.repository.board.BoardRepository;
import com.kh.team119.club.board.repository.comment.CommentRepository;
import com.kh.team119.club.board.repository.like.LikeRepository;
import com.kh.team119.club.board.repository.report.ReportRepository;
import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class CommentService {

    private final CommentRepository commentRepository;
    private final BoardRepository boardRepository;
    private final ReportRepository reportRepository;
    private final LikeRepository likeRepository;
    private final EmployeeRepository employeeRepository;

    public Object commentLookUp(int cPage, int size, Long no) {
        Pageable pageable = PageRequest.of(cPage, size);
        Page<CommentEntity> commentEntities = commentRepository.lookUp(pageable, no);
        List<CommentRespDto.ListRespDto.ListInnerRespDto> data = commentEntities.stream().map(CommentRespDto.ListRespDto.ListInnerRespDto::from).toList();


        return CommentRespDto.ListRespDto.builder()
                .data(data)
                .totalPages(commentEntities.getTotalPages())
                .total(commentEntities.getTotalElements())
                .currentPage(commentEntities.getNumber())
                .pageSize(commentEntities.getSize())
                .build();
    }

    public void commentSave(CommentReqDto.CommentSaveReqDto reqDto) {
        EmployeeEntity employeeEntity = employeeRepository.findByEno(reqDto.getEno());
        BoardEntity boardEntity = boardRepository.findById(reqDto.getBno()).get();
        CommentEntity commentEntity = reqDto.toEntity(employeeEntity, boardEntity);
        commentRepository.save(commentEntity);
    }

    public void commentReport(Long no, CommentReqDto.reportReqDto reqDto) {
        CommentEntity commentEntity = commentRepository.findById(no).get();
            boolean isReport = reportRepository.existsByBnoAndEno(no, reqDto.getEno());
            if (isReport) {
                // 에러 코드 수정 필요 이미 신고된 게시글
                throw new Team119Exception(ErrorCode.NOT_FOUND_CLUB_BOARD);
            }
        ReportEntity reportEntity = ReportEntity.builder()
                .boardEntity(commentEntity.getBoard())
                .type(Type.C)
                .reportContent(reqDto.getReportContent())
                .employeeEntity(commentEntity.getWriter())
                .build();
            reportRepository.save(reportEntity);
    }

    public void commentLikeToggle(Long no, Long eno) {
        CommentEntity commentEntity = commentRepository.findById(no).get();
        EmployeeEntity employeeEntity = employeeRepository.findByEno(eno);
        LikeEntity likeEntity = LikeEntity.builder()
                .type(Type.C)
                .employeeEntity(employeeEntity)
                .boardEntity(commentEntity.getBoard())
                .commentEntity(commentEntity)
                .build();
        boolean existedByEntity = likeRepository.existsByEntity(likeEntity);
        if(existedByEntity){
            likeRepository.deleteByEntity(likeEntity);
        }else {
            likeRepository.save(likeEntity);
        }
    }
}
