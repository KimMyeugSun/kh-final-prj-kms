package com.kh.team119.faq.category.Repository;

import com.kh.team119.faq.category.entity.FaqCategoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

public interface FaqCategoryRepository extends JpaRepository<FaqCategoryEntity, Long>, FaqCategoryRepositoryDSL {
}
