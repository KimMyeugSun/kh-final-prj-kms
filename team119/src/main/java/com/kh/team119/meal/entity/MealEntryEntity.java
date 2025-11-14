package com.kh.team119.meal.entity;

import com.kh.team119.employee.entity.EmployeeEntity;
import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.*;

@Entity
@Table(name = "MEAL_ENTRY")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class MealEntryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "MEAL_NO")
    private Long mealNo;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "EMPLOYEE_NO", nullable = false, foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_MEAL_ENTRY"))
    private EmployeeEntity employee;   // 누가 먹었는지

    @Enumerated(EnumType.STRING)
    @Column(name = "MEAL_TYPE_CODE", length = 3, nullable = false)
    private MealType mealType;

    @Column(name = "EAT_DATE", nullable = false)
    private LocalDate eatDate;

    @Column(name = "TOTAL_KCAL", precision = 7, scale = 1, nullable = false)
    private BigDecimal totalKcal;

    @Enumerated(EnumType.STRING)
    @Column(name = "DONE_YN", length = 1, nullable = false)
    private YesNo doneYn;

    @Column(name = "IMAGE_URL", length = 1000)
    private String imageUrl;

    @Column(name = "MEMO", length = 300)
    private String memo;

    @Column(name = "CREATED_AT", nullable = false)
    private LocalDateTime createdAt;

    @Column(name = "UPDATED_AT")
    private LocalDateTime updatedAt;

    @Column(name = "DELETED_AT")
    private LocalDateTime deletedAt;

    @OneToMany(mappedBy = "meal", cascade = CascadeType.ALL, orphanRemoval = true)
    @Builder.Default
    private List<MealFoodItemEntity> items = new ArrayList<>();

}
