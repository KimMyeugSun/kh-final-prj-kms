package com.kh.team119.welfarepointrecord.repository;

import com.kh.team119.welfarepointrecord.entity.WelfarePointRecordEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface WelfarePointRecordRepository extends JpaRepository<WelfarePointRecordEntity, Long>, WelfarePointRecordRepositoryDSL {

    // 운영에서 아래 쿼리 추가 필요 (월 1회 정기지급되면 이후 이력 테이블 insert 불가
    // 테스트를 위해 주석 처리
//    AND NOT EXISTS (
//            SELECT 1
//                    FROM welfare_point_record r
//                    WHERE r.eno = e.eno
//                    AND r.occurrence_type = :occType
//                    AND date_trunc('month', r.occurrence_at) = date_trunc('month', NOW())
//            )
    @Modifying(clearAutomatically = true, flushAutomatically = true)
    @Query(value = """
        INSERT INTO welfare_point_record
          (eno, amount, occurrence_type, description, before_value, after_value, occurrence_at)
        SELECT
            e.eno,
            :amount,
            :occType,
            :desc,
            e.welfare_points,
            e.welfare_points + :amount,
            NOW()
        FROM employee e
        WHERE e.eno <> 0 AND e.eno < 1000
        """, nativeQuery = true)
    int bulkInsertMonthlyWelfarePoints(long amount, String occType, String desc);

}