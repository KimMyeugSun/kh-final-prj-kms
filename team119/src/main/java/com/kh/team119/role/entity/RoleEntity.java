package com.kh.team119.role.entity;

import com.kh.team119.employee.entity.EmployeeEntity;
import com.kh.team119.roletype.RoleType;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "ROLE",
        indexes = {
                @Index(name = "IDX_ROLE_TYPE", columnList = "roleType"),
                @Index(name = "IDX_EMP_NO", columnList = "employeeNo")
        }
)
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor(access = AccessLevel.PRIVATE)
public class RoleEntity {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long no;

    @Builder.Default
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "employeeNo", nullable = false, foreignKey = @ForeignKey(name = "FK_EMPLOYEE_NO_TO_ROLE"))
    private EmployeeEntity employeeEntity = null;

//    @Builder.Default
//    @ManyToOne(fetch = FetchType.LAZY, optional = false)
//    @JoinColumn(name = "roleTypeNo", nullable = false, foreignKey = @ForeignKey(name = "FK_ROLE_TYPE_NO_TO_ROLE"))
//    private RoleTypeEntity roleTypeEntity = null;
    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 64)
    private RoleType roleType;

    public void addRoleType(RoleType type) {
        roleType = type;
    }

    public void setEmployee(EmployeeEntity employeeEntity) {
        this.employeeEntity = employeeEntity;
    }
}
