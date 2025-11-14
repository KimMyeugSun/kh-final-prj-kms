package com.kh.team119.research.repository.question;

import com.kh.team119.research.entity.QuestionEntity;

import java.util.List;

public interface QuestionRepositoryCustom {
    List<QuestionEntity> findByResearch(Long no);
}
