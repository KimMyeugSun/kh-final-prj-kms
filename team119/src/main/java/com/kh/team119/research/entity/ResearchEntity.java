package com.kh.team119.research.entity;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.research.enums.ResearchCategory;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "RESEARCH")
@Getter
@Builder
@NoArgsConstructor
@AllArgsConstructor
public class ResearchEntity {
    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long no;

    private String title;
    private String topic;
    private String description;
    private LocalDate cycle;
    private String required;
    @Enumerated(EnumType.STRING)
    private ResearchCategory category;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
    @OneToMany(mappedBy = "research", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<ResultEntity> resultEntities;
    @OneToMany(mappedBy = "research", cascade = CascadeType.ALL, orphanRemoval = true)
    private  List<QuestionEntity> questionEntities;
}
