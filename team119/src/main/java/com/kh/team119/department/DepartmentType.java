package com.kh.team119.department;

import com.kh.team119.employee.EmpGradeType;

public enum DepartmentType {
    PROGRAMMING("프로그래밍")
    , DESIGN("디자인")
    , MARKETING("마케팅")
    , SALES("영업")
    , HR("인사")
    , FINANCE("재무")
    , OPERATIONS("운영")
    , CUSTOMER_SERVICE("고객 서비스")
    , IT_SUPPORT("IT 지원")
    , LEGAL("법무")
    , RESEARCH("연구개발")
;
    private String desc;

    DepartmentType(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }

    public static DepartmentType descOf(String desc) {
        for (DepartmentType type : DepartmentType.values()) {
            if (type.getDesc().equals(desc)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown desc: " + desc);
    }
}
