package com.kh.team119.mapinfo.repository.hospital;

import com.kh.team119.mapinfo.entity.hospital.HospitalEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface HospitalRepository extends JpaRepository<HospitalEntity, String>, HospitalRepositoryDSL {
}
