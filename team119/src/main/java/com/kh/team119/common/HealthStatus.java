package com.kh.team119.common;

/**
 * 건강 상태를 나타내는 열거형
 * 건강함은 다른 질병이 없는 상태를 의미 DB에 저장 할 때 예외처리 필요( 건강함과 다른 값이 동시 적용 안되게 )
 *
 */
public enum HealthStatus {
    Healthy("건강함")
    , Diabetes("당뇨")
    , Hypertension("고혈압")
    , Obesity("비만")
    , CardiacIssues("심장 질환")
    ;

    private final String desc;

    HealthStatus(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
