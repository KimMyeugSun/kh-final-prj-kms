package com.kh.team119.faq.repository;

import com.kh.team119.faq.dto.ReqFaqEdit;
import com.kh.team119.faq.entity.FaqEntity;

import java.util.List;

public interface FaqRepositoryDSL {
    List<FaqEntity> findAllJoinFaqCategory();

    void updateEdit(Long faqNo, ReqFaqEdit dto);

    void softDelete(Long faqNo);
}
