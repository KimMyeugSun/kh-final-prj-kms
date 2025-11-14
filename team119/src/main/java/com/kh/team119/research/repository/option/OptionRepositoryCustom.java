package com.kh.team119.research.repository.option;

import com.kh.team119.research.entity.QuestionOptionEntity;

import java.util.List;

public interface OptionRepositoryCustom {
    List<QuestionOptionEntity> findAllByQno(List<Long> qnoList);
}
