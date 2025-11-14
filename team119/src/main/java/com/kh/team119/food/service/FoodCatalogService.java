package com.kh.team119.food.service;

import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.food.dto.FoodDto;
import com.kh.team119.food.entity.FoodCatalogEntity;
import com.kh.team119.food.repository.FoodCatalogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@Service
@RequiredArgsConstructor
public class FoodCatalogService {

    private final FoodCatalogRepository repo;

    public Page<FoodDto.Resp> list(String q, Pageable pageable) {
        Page<FoodCatalogEntity> page = repo.search(q, pageable);
        return page.map(FoodDto.Resp::from);
    }

    public FoodDto.Resp get(Long id) {
        FoodCatalogEntity e = repo.findById(id)
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_FOOD));
        return FoodDto.Resp.from(e);
    }

    public FoodDto.Resp getByName(String name) {
        FoodCatalogEntity e = repo.findFirstByNameIgnoreCase(name.trim())
                .orElseThrow(() -> new Team119Exception(ErrorCode.NOT_FOUND_FOOD));
        return FoodDto.Resp.from(e);
    }

}
