package com.kh.team119.welfarepointrecord;

public enum OccurrenceType {
    NONE("없음")
    , RANK("랭킹보상")
    , MALL("상점")
    , REGULAR("정기지급")
    , EVENT("이벤트")
    ;

    private final String desc;

    OccurrenceType(String desc) {
        this.desc = desc;
    }

    public String getDesc() {
        return desc;
    }
}
