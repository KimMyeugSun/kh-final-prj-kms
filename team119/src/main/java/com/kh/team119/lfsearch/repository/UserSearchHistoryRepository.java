package com.kh.team119.lfsearch.repository;

import com.kh.team119.lfsearch.entity.UserSearchHistoryEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface UserSearchHistoryRepository extends JpaRepository<UserSearchHistoryEntity, Long> {
    List<UserSearchHistoryEntity> findTop10ByEmployeeNoAndDomainCodeOrderBySearchedAtDesc(Integer employeeNo, String domainCode);
}
