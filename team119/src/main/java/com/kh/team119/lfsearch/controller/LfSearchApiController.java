package com.kh.team119.lfsearch.controller;

import com.kh.team119.lfsearch.dto.LfSearchDtos;
import com.kh.team119.lfsearch.service.LfSearchService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/lfsearch")
@RequiredArgsConstructor
public class LfSearchApiController {

    private final LfSearchService service;

    // 검색 기록 저장
    @PostMapping
    public LfSearchDtos.SearchResponse saveSearch(@RequestBody LfSearchDtos.SearchRequest req) {
        return service.saveSearch(req);
    }

    // 최근 검색어 조회 (도메인별)
    @GetMapping("/{employeeNo}/{domainCode}")
    public List<LfSearchDtos.SearchResponse> getRecentSearches(
            @PathVariable Integer employeeNo,
            @PathVariable String domainCode) {
        return service.getRecentSearches(employeeNo, domainCode);
    }
}
