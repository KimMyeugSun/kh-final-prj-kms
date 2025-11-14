package com.kh.team119.faq.repository;

import com.kh.team119.faq.entity.FaqEntity;
import lombok.RequiredArgsConstructor;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

public interface FaqRepository extends JpaRepository<FaqEntity, Long>, FaqRepositoryDSL {
}
