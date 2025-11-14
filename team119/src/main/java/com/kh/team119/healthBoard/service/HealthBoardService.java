package com.kh.team119.healthBoard.service;

import com.kh.team119.common.FileController;
import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.healthBoard.dto.HealthBoardReqDto;
import com.kh.team119.healthBoard.dto.HealthBoardRespDto;
import com.kh.team119.healthBoard.entity.CategoryEntity;
import com.kh.team119.healthBoard.entity.HealthBoardEntity;
import com.kh.team119.healthBoard.repository.HealthBoardRepository;
import com.kh.team119.healthBoard.repository.HealthBoardCategoryRepository;
import com.kh.team119.tag.TagType;
import com.kh.team119.tag.dto.RespTagLookUp;
import com.kh.team119.tag.repository.tag.TagRepository;
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
public class HealthBoardService {

    private final HealthBoardRepository boardRepository;
    private final EmployeeRepository employeeRepository;
    private final HealthBoardCategoryRepository healthBoardCategoryRepository;
    private final FileController fileCtrl;

    @Value("${CDN_ORIGIN.URL}")
    String cdnOriginUrl;
    @Value("${TEMPLATE.STORAGE_PATH.IMG}")
    String templateStoragePath;
    @Value("${HEALTH_BOARD.STORAGE_PATH.IMG}")
    private String healthBoardUploadPath;

    public HealthBoardRespDto.HealthBoardListRespDto boardLookup(int page, int pageLimit) {
        Pageable pageable = PageRequest.of(page, pageLimit);
        Page<HealthBoardEntity> boardEntities = boardRepository.boardLookUp(pageable);
        return HealthBoardRespDto.HealthBoardListRespDto.builder().data(boardEntities
                        .stream().map(HealthBoardRespDto.HealthBoardListRespDto.HealthBoardInnerRespDto::from).toList())
                .totalPages(boardEntities.getTotalPages())
                .total(boardEntities.getTotalElements())
                .currentPage(boardEntities.getNumber())
                .pageSize(boardEntities.getSize())
                .build();
    }

    public void healthBoardSave(HealthBoardReqDto.HealthBoardSaveReqDto reqDto) {
        EmployeeEntity employeeEntity = employeeRepository.findByEno(reqDto.getEno());
        CategoryEntity categoryEntity = healthBoardCategoryRepository.findById(reqDto.getCno()).get();

        for(String tag : reqDto.getTags()) {
            System.out.println("dto-tag = " + tag);
        }

        List<TagType> tagList = reqDto.getTags().stream().map(TagType::descToTagType).toList();
        for(TagType tag : tagList) {
            System.out.println("convert tag = " + tag);
        }
        HealthBoardEntity healthBoardEntity = reqDto.toHealthBoardEntity(employeeEntity, categoryEntity, tagList);
        var templateFiles = reqDto.getImgUrl();

        boardRepository.save(healthBoardEntity);

        if (templateFiles != null && !templateFiles.isEmpty()) {
            var bno = healthBoardEntity.getBno();
            //!< 임시파일 -> 정식파일 이동
            fileCtrl.moveTo(reqDto.getEno(), healthBoardUploadPath, bno, templateFiles);

            //!< 이미지 경로 변경
            healthBoardEntity.convertTemplateImgToRegularImg(reqDto.getEno(), cdnOriginUrl, templateStoragePath, healthBoardUploadPath);
        }
    }

    public List<HealthBoardRespDto.HealthBoardSearchRespDto> healthBoardSearch(HealthBoardReqDto.HealthBoardSearchReqDto reqDto) {
        List<HealthBoardEntity> boardEntities = boardRepository.findByQuery(reqDto.getQuery());
        return boardEntities.stream().map(HealthBoardRespDto.HealthBoardSearchRespDto::from).toList();
    }

    public HealthBoardRespDto.HealthBoardAdminDetailRespDto boardDetail(Long no) {
        HealthBoardEntity healthBoardEntity = boardRepository.findById(no).get();
        CategoryEntity categoryEntity = healthBoardCategoryRepository.findById(healthBoardEntity.getCategory().getCno()).get();

        List<String> tagList = healthBoardEntity.getBoardTags()
                .stream()
                .map(TagType::getDesc)
                .toList();

        return HealthBoardRespDto.HealthBoardAdminDetailRespDto.from(healthBoardEntity, categoryEntity, tagList);
    }

    public void healthBoardEdit(Long no, HealthBoardReqDto.HealthBoardEditReqDto reqDto) {
        // 태그 먼저 수정
        HealthBoardEntity healthBoardEntity = updateBoardTags(no, reqDto.getTags());
        // 최종 게시글 수정
        CategoryEntity categoryEntity = healthBoardCategoryRepository.findById(reqDto.getCno()).get();
        healthBoardEntity.editBoard(reqDto, categoryEntity);
        // 이미지 링크 수정
        var templateFiles = reqDto.getImgUrl();
        if (templateFiles != null && !templateFiles.isEmpty()) {
            var bno = healthBoardEntity.getBno();
            //!< 임시파일 -> 정식파일 이동
            if(fileCtrl.moveTo(reqDto.getEno(), healthBoardUploadPath, bno, templateFiles)) {
                //!< 이미지 경로 변경
                healthBoardEntity.convertTemplateImgToRegularImg(reqDto.getEno(), cdnOriginUrl, templateStoragePath, healthBoardUploadPath);
            }
        }
    }

    public HealthBoardEntity updateBoardTags(Long bno, List<String> tags) {
        List<TagType> oldTags = tags.stream().map(TagType::descToTagType).toList();
        HealthBoardEntity boardEntity = boardRepository.findById(bno).get();
        boardEntity.removeTag(oldTags);
        boardEntity.addTag(oldTags);
        return boardEntity;
    }

    public void healthBoardDelete(Long no) {
        HealthBoardEntity healthBoardEntity = boardRepository.findById(no).get();

        healthBoardEntity.deleteBoard();
    }

}
