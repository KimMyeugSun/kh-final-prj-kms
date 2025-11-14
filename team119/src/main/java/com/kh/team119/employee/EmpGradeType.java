package com.kh.team119.employee;

public enum EmpGradeType {
    Employee("사원")
    , Associate("주임")
    , AssistantManager("대리")
    , Manager("과장")
    , SeniorManager("차장")
    , DepartmentHead("부장")
    , Director("임원")
    , ChiefExecutiveOfficer("CEO")
    , Chairman("회장")
;

    private String desc;

    EmpGradeType(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }

    public static EmpGradeType descOf(String desc) {
        for (EmpGradeType type : EmpGradeType.values()) {
            if (type.getDesc().equals(desc)) {
                return type;
            }
        }
        throw new IllegalArgumentException("Unknown desc: " + desc);
    }
}
