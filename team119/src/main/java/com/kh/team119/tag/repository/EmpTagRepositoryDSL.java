package com.kh.team119.tag.repository;

import com.kh.team119.tag.TagType;
import com.kh.team119.tag.entity.EmpTagEntity;

import java.util.List;

public interface EmpTagRepositoryDSL {
    boolean existsByTagAndEno(TagType tag, Long eno);

    void delete(TagType tag, Long eno);

    long deleteByEmployeeAndTopic(Long eno, String topic);

    List<EmpTagEntity> findByEno(Long eno);
}
