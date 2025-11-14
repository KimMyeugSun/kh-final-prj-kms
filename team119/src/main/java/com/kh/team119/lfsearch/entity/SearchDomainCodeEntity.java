package com.kh.team119.lfsearch.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.Data;

@Entity
@Table(name = "SEARCH_DOMAIN_CODE")
@Data
public class SearchDomainCodeEntity {

    @Id
    @Column(name = "SD_CODE", length = 20, nullable = false)
    private String code;   // "MEAL" or "EXERCISE"

    @Column(name = "SD_NAME", length = 20, nullable = false)
    private String name;   // "식단", "운동"
}
