package com.kh.team119.research.repository.option;

import com.kh.team119.research.entity.QuestionOptionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface OptionRepository extends JpaRepository<QuestionOptionEntity, Long>, OptionRepositoryCustom {
}
