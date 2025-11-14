package com.kh.team119.mapinfo.dto;

import com.kh.team119.mapinfo.entity.hospital.HospitalEntity;
import com.kh.team119.mapinfo.entity.pharmacy.PharmacyEntity;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;

import java.util.List;

@Getter
@Setter
public class MapVo {
    private String id;
    private String dutyDiv;
    private String dutyAddr;
    private String dutyName;
    private String dutyTel1;
    private List<String> workDayOfWeek;
    private Double wgs84lon;
    private Double wgs84lat;

    public static MapVo from(HospitalEntity entity) {
        MapVo mapVo = new MapVo();
        mapVo.setId(entity.getHospitalId());
        mapVo.setDutyDiv(entity.getDutyDiv());
        mapVo.setDutyAddr(entity.getDutyAddr());
        mapVo.setDutyName(entity.getDutyName());
        mapVo.setDutyTel1(entity.getDutyTel1());

        mapVo.setWorkDayOfWeek(
                List.of(
                        String.format("월: %s ~ %s", entity.getDutyTime1S(), entity.getDutyTime1C()),
                        String.format("화: %s ~ %s", entity.getDutyTime2S(), entity.getDutyTime2C()),
                        String.format("수: %s ~ %s", entity.getDutyTime3S(), entity.getDutyTime3C()),
                        String.format("목: %s ~ %s", entity.getDutyTime4S(), entity.getDutyTime4C()),
                        String.format("금: %s ~ %s", entity.getDutyTime5S(), entity.getDutyTime5C()),
                        String.format("토: %s ~ %s", entity.getDutyTime6S(), entity.getDutyTime6C()),
                        String.format("일: %s ~ %s", entity.getDutyTime7S(), entity.getDutyTime7C()),
                        String.format("공휴일: %s ~ %s", entity.getDutyTime8S(), entity.getDutyTime8C())
                ));

        mapVo.setWgs84lon(entity.getWgs84lon());
        mapVo.setWgs84lat(entity.getWgs84lat());
        return mapVo;
    }

    public static MapVo from(PharmacyEntity entity) {
        MapVo mapVo = new MapVo();
        mapVo.setId(entity.getPharmacyId());
        mapVo.setDutyAddr(entity.getDutyAddr());
        mapVo.setDutyName(entity.getDutyName());
        mapVo.setDutyTel1(entity.getDutyTel1());
        mapVo.setWorkDayOfWeek(
                List.of(
                        String.format("월: %s ~ %s", entity.getDutyTime1S(), entity.getDutyTime1C()),
                        String.format("화: %s ~ %s", entity.getDutyTime2S(), entity.getDutyTime2C()),
                        String.format("수: %s ~ %s", entity.getDutyTime3S(), entity.getDutyTime3C()),
                        String.format("목: %s ~ %s", entity.getDutyTime4S(), entity.getDutyTime4C()),
                        String.format("금: %s ~ %s", entity.getDutyTime5S(), entity.getDutyTime5C()),
                        String.format("토: %s ~ %s", entity.getDutyTime6S(), entity.getDutyTime6C()),
                        String.format("일: %s ~ %s", entity.getDutyTime7S(), entity.getDutyTime7C()),
                        String.format("공휴일: %s ~ %s", entity.getDutyTime8S(), entity.getDutyTime8C())
                ));
        mapVo.setWgs84lon(entity.getWgs84lon());
        mapVo.setWgs84lat(entity.getWgs84lat());
        return mapVo;
    }
}
