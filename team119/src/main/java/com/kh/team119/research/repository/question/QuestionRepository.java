package com.kh.team119.research.repository.question;

import com.kh.team119.research.entity.QuestionEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QuestionRepository extends JpaRepository<QuestionEntity, Long>, QuestionRepositoryCustom {
}
