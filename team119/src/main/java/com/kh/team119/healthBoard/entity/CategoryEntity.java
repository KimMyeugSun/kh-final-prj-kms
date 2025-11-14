package com.kh.team119.healthBoard.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Getter
@Table(name = "HEALTH_BOARD_CATEGORY")
@Builder
@AllArgsConstructor
@NoArgsConstructor
public class CategoryEntity {

    @Id @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long cno;

    @Column(length = 50)
    private String name;
}