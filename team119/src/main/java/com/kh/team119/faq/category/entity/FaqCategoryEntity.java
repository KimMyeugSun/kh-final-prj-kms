package com.kh.team119.faq.category.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "FAQ_CATEGORY",
        uniqueConstraints = @UniqueConstraint(
                name = "UK_FAQ_CATEGORY_NAME"
                , columnNames = {"faqCategoryName"}
        )
)
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class FaqCategoryEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long faqCategoryNo;

    @Column(columnDefinition = "VARCHAR(100)", nullable = false, unique = true)
    private String faqCategoryName;
}
