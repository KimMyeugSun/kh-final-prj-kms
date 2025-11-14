package com.kh.team119.faq.category.service;

import com.kh.team119.common.exception.ErrorCode;
import com.kh.team119.common.exception.Team119Exception;
import com.kh.team119.faq.category.Repository.FaqCategoryRepository;
import com.kh.team119.faq.category.dto.ReqFaqCategoryInsert;
import com.kh.team119.faq.category.dto.RespFaqCategoryInsert;
import com.kh.team119.faq.category.dto.RespFaqCategoryList;
import com.kh.team119.faq.category.entity.FaqCategoryEntity;
import jakarta.persistence.*;
import jakarta.transaction.Transactional;
import lombok.*;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class FaqCategoryService {
    private final FaqCategoryRepository faqCategoryRepository;

    public RespFaqCategoryInsert insert(ReqFaqCategoryInsert dto) {
        FaqCategoryEntity entity = null;
        try {
            entity = dto.toEntity();
            faqCategoryRepository.save(entity);
        } catch (PersistenceException e) {
            throw new Team119Exception(ErrorCode.FAQ_CATEGORY_DUPLICATE);
        }

        return RespFaqCategoryInsert.builder()
                .faqCategoryNo(entity.getFaqCategoryNo())
                .faqCategoryName(entity.getFaqCategoryName())
                .build();
    }

    public RespFaqCategoryList findAll() {
        var result = faqCategoryRepository.findAll();

        return RespFaqCategoryList.from(result);
    }
}
