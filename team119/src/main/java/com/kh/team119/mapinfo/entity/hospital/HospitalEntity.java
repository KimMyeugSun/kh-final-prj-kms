package com.kh.team119.mapinfo.entity.hospital;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "HOSPITAL")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class HospitalEntity {
    @Id
    private String hospitalId;
    private String dutyAddr;
    @Column(length = 1024)
    private String dutyEtc;
    @Column(length = 512)
    private String dutyInf;
    private String dutyMapImg;
    @Column(length = 64)
    private String dutyName;
    @Column(length = 16)
    private String dutyTel1;
    @Column(length = 16)
    private String dutyTel3;
    @Column(length = 1)
    private String dutyDiv;
    @Column(length = 16)
    private String dutyDivNam;
    @Column(length = 4)
    private String dutyEmCls;
    @Column(length = 32)
    private String dutyEmClsName;
    @Column(length = 1)
    private String dutyErYn;
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
    @Column(length = 4)
    private String postCDN1;
    @Column(length = 4)
    private String postCDN2;
    private double wgs84lon;
    private double wgs84lat;
}
