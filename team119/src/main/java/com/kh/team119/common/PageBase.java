package com.kh.team119.common;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.Setter;
import lombok.experimental.SuperBuilder;

@Getter
@Setter
@SuperBuilder
public class PageBase {
    private int totalPages;         //!< 전체 페이지 수
    private Long total;             //!< 전체 수
    private int currentPage;        //!< 현재 페이지
    private int pageSize;           //!< 한 페이지에 보여줄 데이터 수
}
