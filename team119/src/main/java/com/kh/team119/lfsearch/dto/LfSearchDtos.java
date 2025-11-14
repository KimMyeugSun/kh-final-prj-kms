package com.kh.team119.lfsearch.dto;

import lombok.*;

public class LfSearchDtos {

    // 요청 DTO
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SearchRequest {
        private String keyword;     // 검색어
        private String domainCode;  // "MEAL" 또는 "EXERCISE"
        private Integer employeeNo; // 사용자 구분용
        private Integer foodNo;     // 음식 고유번호 (선택)
        private Integer exerciseNo; // 운동 고유번호 (선택)
    }

    // 응답 DTO
    @Getter
    @Setter
    @NoArgsConstructor
    @AllArgsConstructor
    @Builder
    public static class SearchResponse {
        private Long searchNo;        // 검색 기록 PK
        private Integer employeeNo;   // 사용자 번호
        private String keyword;       // 검색어
        private String domainCode;    // 도메인 코드
        private String domainName;    // 도메인명 (추후 JOIN으로 조회 가능)
        private Integer foodNo;       // 음식 고유번호 (nullable)
        private Integer exerciseNo;   // 운동 고유번호 (nullable)
        private String searchedAt;    // 검색 시각 (문자열 변환)
    }
}
