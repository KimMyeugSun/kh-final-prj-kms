package com.kh.team119.lfsearch.service;

import com.kh.team119.lfsearch.dto.LfSearchDtos;
import com.kh.team119.lfsearch.entity.UserSearchHistoryEntity;
import com.kh.team119.lfsearch.repository.UserSearchHistoryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class LfSearchService {

    private final UserSearchHistoryRepository historyRepository;

    public LfSearchDtos.SearchResponse saveSearch(LfSearchDtos.SearchRequest req) {
        UserSearchHistoryEntity entity = new UserSearchHistoryEntity();
        entity.setEmployeeNo(req.getEmployeeNo());
        entity.setDomainCode(req.getDomainCode());
        entity.setKeyword(req.getKeyword());
        entity.setFoodNo(req.getFoodNo());
        entity.setExerciseNo(req.getExerciseNo());

        UserSearchHistoryEntity saved = historyRepository.save(entity);

        return LfSearchDtos.SearchResponse.builder()
                .searchNo(saved.getId())
                .employeeNo(saved.getEmployeeNo())
                .domainCode(saved.getDomainCode())
                .keyword(saved.getKeyword())
                .foodNo(saved.getFoodNo())
                .exerciseNo(saved.getExerciseNo())
                .searchedAt(saved.getSearchedAt().toString())
                .build();
    }

    public List<LfSearchDtos.SearchResponse> getRecentSearches(Integer employeeNo, String domainCode) {
        return historyRepository.findTop10ByEmployeeNoAndDomainCodeOrderBySearchedAtDesc(employeeNo, domainCode)
                .stream()
                .map(e -> LfSearchDtos.SearchResponse.builder()
                        .searchNo(e.getId())
                        .employeeNo(e.getEmployeeNo())
                        .domainCode(e.getDomainCode())
                        .keyword(e.getKeyword())
                        .foodNo(e.getFoodNo())
                        .exerciseNo(e.getExerciseNo())
                        .searchedAt(e.getSearchedAt().toString())
                        .build())
                .collect(Collectors.toList());
    }
}
