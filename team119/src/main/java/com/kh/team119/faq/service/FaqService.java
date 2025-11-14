package com.kh.team119.faq.service;

import com.kh.team119.faq.category.Repository.FaqCategoryRepository;
import com.kh.team119.faq.category.service.FaqCategoryService;
import com.kh.team119.faq.dto.*;
import com.kh.team119.faq.entity.FaqEntity;
import com.kh.team119.faq.repository.FaqRepository;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@Transactional
@RequiredArgsConstructor
public class FaqService {
    private final FaqRepository faqRepository;
    private final FaqCategoryRepository faqCategoryRepository;

    public void register(ReqFaqRegister dto) {
        var faqCatetoryEntity = faqCategoryRepository.findById(dto.getFaqCategoryNo());

        if (faqCatetoryEntity.isEmpty()) {
            throw new IllegalArgumentException("Invalid FAQ category number: " + dto.getFaqCategoryNo());
        }

        faqRepository.save(dto.toEntity(faqCatetoryEntity.get()));
    }

    public RespFaqLookUp findAll() {
        List<FaqEntity> result = faqRepository.findAllJoinFaqCategory();

        return RespFaqLookUp.from(result);
    }

    public RespFaqLookAt LookAt(Long faqNo) {
        var result = faqRepository.findById(faqNo);

        if (result.isEmpty()) {
            throw new IllegalArgumentException("Invalid FAQ number: " + faqNo);
        }

        return RespFaqLookAt.from(result.get());
    }

    public void edit(Long faqNo, ReqFaqEdit dto) {
        faqRepository.updateEdit(faqNo, dto);
    }

    public void softDelete(Long faqNo) {
        faqRepository.softDelete(faqNo);
    }
}
