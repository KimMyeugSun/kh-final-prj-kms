package com.kh.team119.research.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "RESEARCH_QUESTIONS")
@Builder
@AllArgsConstructor
@NoArgsConstructor
@Getter
public class QuestionEntity {

    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long qno;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "rno")
    private ResearchEntity research;
    @Column(nullable = false)
    private String question;
    @Column(nullable = false)
    private String required;
    @Builder.Default
    private LocalDateTime createdAt = LocalDateTime.now();
    private LocalDateTime updatedAt;
    private LocalDateTime deletedAt;
    @OneToMany(mappedBy = "question", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<QuestionOptionEntity> optionEntities;

}
