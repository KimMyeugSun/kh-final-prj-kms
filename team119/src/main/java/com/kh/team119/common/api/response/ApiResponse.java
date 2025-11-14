package com.kh.team119.common.api.response;


import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;

@Getter
@Builder
@AllArgsConstructor
public class ApiResponse<T> {
    private final boolean success;      // 성공 여부
    private final String msg;           // 응답 메시지
    private final T data;               // 응답 데이터
}
