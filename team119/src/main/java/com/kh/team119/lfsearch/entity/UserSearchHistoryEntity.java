package com.kh.team119.lfsearch.entity;

import jakarta.persistence.*;
import lombok.Data;
import java.time.LocalDateTime;

@Entity
@Table(name = "USER_SEARCH_HISTORY")
@Data
public class UserSearchHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "US_NO")
    private Long id;

    @Column(name = "ENO", nullable = false)
    private Integer employeeNo;

    @Column(name = "SD_CODE", length = 20, nullable = false)
    private String domainCode;

    @Column(name = "US_KEYWORD", length = 100)
    private String keyword;

    @Column(name = "FNO")
    private Integer foodNo;

    @Column(name = "EX_NO")
    private Integer exerciseNo;

    @Column(name = "US_AT")
    private LocalDateTime searchedAt = LocalDateTime.now();
}
