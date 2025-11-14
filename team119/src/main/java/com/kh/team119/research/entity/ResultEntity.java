package com.kh.team119.research.entity;

import com.kh.team119.employee.entity.EmployeeEntity;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;

@Entity
@Table(name = "RESEARCH_RESULT")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResultEntity {

    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rno", nullable = false)
    private ResearchEntity research;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eno")
    private EmployeeEntity employee;
    private int attemptNo;
    private int score;
    private String summary;
    @Builder.Default
    private LocalDate submitDate = LocalDate.now();
}
