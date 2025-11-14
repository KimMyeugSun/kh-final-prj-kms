package com.kh.team119.tag.repository.tag;

import com.kh.team119.tag.entity.TagEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface TagRepository extends JpaRepository<TagEntity, Long>, TagRepositoryCustom {
}
