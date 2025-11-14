package com.kh.team119.mapinfo.entity.pharmacy;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.*;

@Entity
@Table(name = "PHARMACY")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class PharmacyEntity {
    @Id
    private String pharmacyId;
    private String dutyAddr;
    @Column(length = 64)
    private String dutyName;
    @Column(length = 16)
    private String dutyTel1;
    @Column(length = 4)
    private String dutyTime1C;
    @Column(length = 4)
    private String dutyTime2C;
    @Column(length = 4)
    private String dutyTime3C;
    @Column(length = 4)
    private String dutyTime4C;
    @Column(length = 4)
    private String dutyTime5C;
    @Column(length = 4)
    private String dutyTime6C;
    @Column(length = 4)
    private String dutyTime7C;
    @Column(length = 4)
    private String dutyTime8C;
    @Column(length = 4)
    private String dutyTime1S;
    @Column(length = 4)
    private String dutyTime2S;
    @Column(length = 4)
    private String dutyTime3S;
    @Column(length = 4)
    private String dutyTime4S;
    @Column(length = 4)
    private String dutyTime5S;
    @Column(length = 4)
    private String dutyTime6S;
    @Column(length = 4)
    private String dutyTime7S;
    @Column(length = 4)
    private String dutyTime8S;
    @Column(length = 8)
    private String postCDN1;
    @Column(length = 8)
    private String postCDN2;
    private double wgs84lon;
    private double wgs84lat;
}
