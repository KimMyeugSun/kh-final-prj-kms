package com.kh.team119.noticeboard.repository;

import com.kh.team119.noticeboard.entity.NoticeBoardEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface NoticeBoardRepository extends JpaRepository<NoticeBoardEntity, Long>, NoticeBoardRepositoryDSL {
}
