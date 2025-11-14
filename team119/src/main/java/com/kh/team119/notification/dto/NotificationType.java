package com.kh.team119.notification.dto;

public enum NotificationType {
    normal(0, "일반 알림")
    , important(1, "중요 알림")
    , urgent(2, "긴급 알림")
    , admin(3, "관리자 알림")
    ;

    private final int code;
    private final String description;

    NotificationType(int code, String description) {
        this.code = code;
        this.description = description;
    }

    public int getCode() {
        return code;
    }

    public String getDesc() {
        return description;
    }
}
