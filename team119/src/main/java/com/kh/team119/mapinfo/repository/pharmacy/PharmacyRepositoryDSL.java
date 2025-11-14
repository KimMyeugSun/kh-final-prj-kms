package com.kh.team119.mapinfo.repository.pharmacy;


import com.kh.team119.mapinfo.entity.pharmacy.PharmacyEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface PharmacyRepositoryDSL {
    List<PharmacyEntity> findPharmacies(Double lon, Double lat, Double radiusKm);
}
