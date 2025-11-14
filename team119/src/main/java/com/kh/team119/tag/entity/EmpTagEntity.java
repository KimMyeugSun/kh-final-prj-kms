package com.kh.team119.tag.entity;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.tag.TagType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "EMP_TAG"
)
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class EmpTagEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long tno;

    @Enumerated(EnumType.STRING)
    @Column(columnDefinition = "VARCHAR(64)", nullable = false)
    private TagType tag;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "eno", nullable = false, foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_EMP_TAG"))
    private EmployeeEntity employeeEntity;

    public void setEmployee(EmployeeEntity employee) {
        this.employeeEntity = employee;
    }
}
