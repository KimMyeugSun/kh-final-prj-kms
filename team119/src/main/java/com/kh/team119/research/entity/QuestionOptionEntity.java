package com.kh.team119.research.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "QUESTION_OPTION")
@Getter
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class QuestionOptionEntity {

    @Id@GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long ono;
    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "qno", nullable = false)
    private QuestionEntity question;
    @Column(nullable = false)
    private String option;
    @Column(nullable = false)
    private int value;
}
