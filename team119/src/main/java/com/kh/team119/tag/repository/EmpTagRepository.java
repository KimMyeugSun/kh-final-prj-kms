package com.kh.team119.tag.repository;

import com.kh.team119.tag.entity.EmpTagEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface EmpTagRepository extends JpaRepository<EmpTagEntity, Long>, EmpTagRepositoryDSL {
}
