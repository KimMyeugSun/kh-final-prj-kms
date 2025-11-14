package com.kh.team119.department.entity;

import com.kh.team119.department.DepartmentType;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(
        name = "DEPARTMENT",
        uniqueConstraints = @UniqueConstraint(
                name = "UK_DEPARTMENT_NAME",
                columnNames = {"name"}
        ),
        indexes = {
                @Index(name = "IDX_DEPARTMENT_NO", columnList = "dno"),
        }
)
@Getter
@NoArgsConstructor
public class DepartmentEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long dno;

    @Column(columnDefinition = "VARCHAR(128)", nullable = false, unique = true)
    @Enumerated(EnumType.STRING)
    private DepartmentType name;
}
