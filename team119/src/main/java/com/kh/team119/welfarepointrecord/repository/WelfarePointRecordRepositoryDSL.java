package com.kh.team119.welfarepointrecord.repository;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.welfarepointrecord.OccurrenceType;
import com.kh.team119.welfarepointrecord.entity.WelfarePointRecordEntity;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;

import java.util.List;

public interface WelfarePointRecordRepositoryDSL {

    Page<WelfarePointRecordEntity> findByWprEmpNo(Long eno, String keyword, Pageable pageable);
}
