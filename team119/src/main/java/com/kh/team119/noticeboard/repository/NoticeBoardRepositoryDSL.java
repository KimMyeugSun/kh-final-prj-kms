package com.kh.team119.noticeboard.repository;

import com.kh.team119.noticeboard.entity.NoticeBoardEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface NoticeBoardRepositoryDSL {
    Page<NoticeBoardEntity> findAllAndDeletedAtIsNull(Pageable pageable);

    NoticeBoardEntity findByNoticeBoardNo(Long no);

    List<NoticeBoardEntity> xLatest(int size);
}
