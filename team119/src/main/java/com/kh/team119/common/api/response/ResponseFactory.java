package com.kh.team119.common.api.response;

// ApiResponse<T>를 쉽게 쓸 수 있게 하는 헬퍼 클래스
// 성공/실패 응답을 정형화된 형태로 생성
public class ResponseFactory {

    //  성공 - 데이터 없이 성공 응답
    public static ApiResponse<Void> success(String msg) {
        return ApiResponse.<Void>builder()
                .success(true)
                .msg(msg)
                .data(null)
                .build();
    }


    // 성공 - 기본 메시지 success
    public static <T> ApiResponse<T> success(T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .msg("SUCCESS")
                .data(data)
                .build();
    }


    // 성공 - 커스텀 메시지
    public static <T> ApiResponse<T> success(String msg, T data) {
        return ApiResponse.<T>builder()
                .success(true)
                .msg(msg)
                .data(data)
                .build();
    }


    // 실패
    public static ApiResponse<Void> failure(String msg) {
        return ApiResponse.<Void>builder()
                .success(false)
                .msg(msg)
                .data(null)
                .build();
    }
}
