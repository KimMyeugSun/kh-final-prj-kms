package com.kh.team119.common;

/**
 * 흡연 상태를 나타내는 열거형
 */
public enum SmokingStatus{
    NonSmoker("비흡연자")
    , Smoker("흡연자")
    , ExSmoker("과거흡연자")
    ;

    private final String desc;

    SmokingStatus(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
