package com.kh.team119.mapinfo.service;

import com.kh.team119.mapinfo.dto.MapVo;
import com.kh.team119.mapinfo.dto.RespMap;
import com.kh.team119.mapinfo.repository.hospital.HospitalRepository;
import com.kh.team119.mapinfo.repository.pharmacy.PharmacyRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;
import java.util.Map;

@Service
@Transactional
@RequiredArgsConstructor
public class MapInfoService {
    private final HospitalRepository hospitalRepository;
    private final PharmacyRepository pharmacyRepository;


    @Value("${kakao.rest.key}")
    private String kakaoRestKey;

    public RespMap searchMapInfo(Double lon, Double lat, Double radius, List<String> filters) {
        var hospitals = hospitalRepository.findHospitals(lon, lat, radius, filters);
        var pharmacies = pharmacyRepository.findPharmacies(lon, lat, radius);

        var hos = hospitals.stream().map(MapVo::from).toList();
        var pha = pharmacies.stream().map(MapVo::from).toList();

        var merged = new java.util.ArrayList<>(hos);
        merged.addAll(pha);

        return RespMap.from(merged);
    }

    public Map<String, Object> searchPlaces(String query) {
        RestTemplate rest = new RestTemplate();
        String url = "https://dapi.kakao.com/v2/local/search/keyword.json?query=" + query;
        HttpHeaders headers = new HttpHeaders();
        headers.set("Authorization", "KakaoAK " + kakaoRestKey);
        HttpEntity<Void> entity = new HttpEntity<>(headers);
        var typeRef = new org.springframework.core.ParameterizedTypeReference<Map<String, Object>>() {};

        return rest.exchange(url, HttpMethod.GET, entity, typeRef).getBody();
    }
}
