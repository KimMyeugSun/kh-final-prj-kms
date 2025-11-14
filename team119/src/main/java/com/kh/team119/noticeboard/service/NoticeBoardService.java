package com.kh.team119.noticeboard.service;

import com.kh.team119.common.FileController;
import com.kh.team119.noticeboard.dto.ReqNoticeBoardEdit;
import com.kh.team119.noticeboard.dto.ReqNoticeBoardRegister;
import com.kh.team119.noticeboard.dto.RespNoticeBoardList;
import com.kh.team119.noticeboard.dto.RespNoticeBoardLookAt;
import com.kh.team119.noticeboard.repository.NoticeBoardRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class NoticeBoardService {
    @Value("${CDN_ORIGIN.URL}") String cdnOriginUrl;
    @Value("${TEMPLATE.STORAGE_PATH.IMG}") String templateStoragePath;
    @Value("${NOTICE_BOARD.STORAGE_PATH.IMG}") String noticeBoardStoragePath;

    private final NoticeBoardRepository noticeBoardRepository;
    private final FileController fileCtrl;

    public void register(Long eno, ReqNoticeBoardRegister dto) {
        var entity = dto.toEntity();

        noticeBoardRepository.save(entity);

        //!< 이미지 임시파일 있을 경우
        var templateFiles = dto.getTemplateFiles();
        if (templateFiles != null && !templateFiles.isEmpty()) {
            var noticeBoardNo = entity.getNoticeBoardNo();
            //!< 임시파일 -> 정식파일 이동
            fileCtrl.moveTo(eno, noticeBoardStoragePath, noticeBoardNo, templateFiles);

            //!< 이미지 경로 변경
            entity.convertTemplateImgToRegularImg(eno, cdnOriginUrl, templateStoragePath, noticeBoardStoragePath);
        }
    }

    public RespNoticeBoardList findAll(Pageable pageable) {
        var result = noticeBoardRepository.findAllAndDeletedAtIsNull(pageable);

        return RespNoticeBoardList.from(result);
    }

    public RespNoticeBoardLookAt lookAt(Long no, boolean canIncViewCount) {
        var result = noticeBoardRepository.findByNoticeBoardNo(no);

        //!<관리자가 조회시 조회수 증가 안함
        if(canIncViewCount)
            result.incViewCount();

        return RespNoticeBoardLookAt.from(result);
    }

    public void edit(Long noticeBoardNo, ReqNoticeBoardEdit dto) {

        var entity = noticeBoardRepository.findByNoticeBoardNo(noticeBoardNo);
        entity.edit(dto);

        var templateFiles = dto.getTemplateFiles();
        if( templateFiles != null && !templateFiles.isEmpty()) {
            var eno = dto.getEno();
            //!< 임시파일 -> 정식파일 이동
            fileCtrl.moveTo(eno, noticeBoardStoragePath, noticeBoardNo, templateFiles);

            //!< 이미지 경로 변경
            entity.convertTemplateImgToRegularImg(eno, cdnOriginUrl, templateStoragePath, noticeBoardStoragePath);
        }
    }

    public void softDelete(Long noticeBoardNo) {
        var entity = noticeBoardRepository.findByNoticeBoardNo(noticeBoardNo);
        entity.softDelete();
        //!< soft delete 이미지 삭제는 나중에 처리 복구를 위해?
    }

    public RespNoticeBoardList xLatest(int size) {
        var result = noticeBoardRepository.xLatest(size);

        return RespNoticeBoardList.from(result);
    }
}
