package com.kh.team119.common.exception;

import lombok.Getter;
import lombok.RequiredArgsConstructor;

@RequiredArgsConstructor
@Getter
public enum ErrorCode {
    //!< 자동 정렬 하지마셈!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!
    UNKNOWN("COMMON", 0, "알 수 없는 에러가 발생했습니다.")
    , EXPIRED_TOKEN("COMMON", 1, "만료된 토큰입니다.")
    , FILE_UPLOAD_FAIL("COMMON", 2, "파일 업로드에 실패했습니다.")
    , FILE_EMPTY("COMMON", 3, "업로드할 파일이 없습니다.")
    , FILE_DELETE_FAIL("COMMON", 4, "파일 삭제에 실패했습니다.")
    , FILE_MOVE_FAIL("COMMON", 5, "파일 이동에 실패했습니다.")
    , NOT_FOUND_FILE("COMMON", 6, "존재하지 않는 파일입니다.")
    , NOT_FOUND_HEALTH_CHECKUP_ATTACHMENT("COMMON", 5, "존재하지 않는 건강검진 첨부파일입니다.")

    , FAILED_TO_SIGNUP("ACCOUNT", 1000, "회원가입에 실패했습니다.")

    , VALIDATE_ID("ACCOUNT", 1010, "아이디는 4자 이상 20자 이하의 영문 대소문자, 숫자만 가능합니다.")
    , VALIDATE_PASSWORD("ACCOUNT", 1011, "비밀번호는 8자 이상 20자 이하의 영문 대소문자, 숫자, 특수문자가 각각 1자 이상 포함되어야 합니다.")
    , DUPLICATE_ID("ACCOUNT", 1012, "이미 사용중인 아이디입니다.")

    , NOT_FOUND_ACCOUNT("ACCOUNT", 1100, "계정이 존재하지 않습니다.")
    , MISMATCH_PASSWORD("ACCOUNT", 1101, "비밀번호가 일치하지 않습니다.")
    , FAILED_MODIFY_PASSWORD("ACCOUNT", 1102, "비밀번호 변경에 실패했습니다.")
    , FAILED_DELETE_ACCOUNT("ACCOUNT", 1103, "계정 삭제에 실패했습니다.")
    , WITHDRAWN_ACCOUNT("ACCOUNT", 1104, "탈퇴한 계정입니다.")

    , NOT_FOUND_DEPARTMENT("DEPARTMENT", 3000, "존재하지 않는 부서입니다.")

    , FAILED_TO_SAVE_PRODUCT("PRODUCT", 6000, "상품 등록에 실패했습니다.")
    , NOT_FOUND_PRODUCT("PRODUCT", 6001, "존재하지 않는 상품입니다.")
    , FAILED_TO_UPDATE_PRODUCT("PRODUCT", 6002, "상품 수정에 실패했습니다.")
    , FAILED_TO_DELETE_PRODUCT("PRODUCT", 6003, "상품 삭제에 실패했습니다.")
    , NOT_ENOUGH_STOCK("PRODUCT", 6004, "상품 재고가 부족합니다.")

    , NOT_FOUND_CLUB_BOARD("CLUB_BOARD", 7000, "창설된 동호회가 없습니다.")

    , FAILED_TO_SAVE_CHALLENGE("CHALLENGE", 8000, "챌린지 등록에 실패했습니다.")
    , NOT_FOUND_CHALLENGE("CHALLENGE", 8001, "존재하지 않는 챌린지입니다.")
    , FAILED_TO_UPDATE_CHALLENGE("CHALLENGE", 8002, "챌린지 수정에 실패했습니다.")
    , FAILED_TO_DELETE_CHALLENGE("CHALLENGE", 8003, "챌린지 삭제에 실패했습니다.")

    , FAILED_TO_SAVE_PARTICIPANT("CHALLENGE_PARTICIPANT", 8100,"챌린지 참여 등록에 실패했습니다.")
    , FAILED_TO_UPDATE_PARTICIPANT("CHALLENGE_PARTICIPANT", 8101,  "챌린지 참여 상태 변경에 실패했습니다.")
    , NOT_FOUND_CHALLENGE_PARTICIPANT("CHALLENGE_PARTICIPANT", 8102, "챌린지 참여 기록이 존재하지 않습니다.")

    , FAILED_TO_SAVE_CERT_RECORD("CHALLENGE_CERT_RECORD", 8200, "챌린지 인증 기록 등록에 실패했습니다.")
    , NOT_FOUND_CERT_RECORD("CHALLENGE_CERT_RECORD", 8201, "존재하지 않는 챌린지 인증 기록입니다.")
    , FAILED_TO_UPDATE_CERT_RECORD("CHALLENGE_CERT_RECORD", 8202, "챌린지 인증 기록 수정에 실패했습니다.")
    , FAILED_TO_DELETE_CERT_RECORD("CHALLENGE_CERT_RECORD", 8203, "챌린지 인증 기록 삭제에 실패했습니다.")

    , FAILED_TO_SAVE_RANKING("RANKING", 9000, "랭킹 저장에 실패했습니다.")
    , FAILED_TO_DISTRIBUTE_REWARD("RANKING", 9001, "랭킹 보상 지급에 실패했습니다.")

    , FAILED_TO_SAVE_WELFARE_POINT("WELFARE_POINT", 9100, "복지 포인트 저장에 실패했습니다.")
    , FAILED_TO_DISTRIBUTE_REGULAR_POINT("WELFARE_POINT", 9102, "정기 복지 포인트 지급에 실패했습니다.")
    , INSUFFICIENT_WELFARE_POINTS("WELFARE_POINT", 9103, "복지 포인트가 부족합니다.")

    , NOT_FOUND_EXERCISE("EXERCISE", 12000, "존재하지 않는 운동입니다.")
    , FAILED_TO_SAVE_EXERCISE("EXERCISE", 12001, "운동 저장에 실패했습니다.")
    , FAILED_TO_UPDATE_EXERCISE("EXERCISE", 12002, "운동 수정에 실패했습니다.")
    , FAILED_TO_DELETE_EXERCISE("EXERCISE", 12003, "운동 삭제에 실패했습니다.")

    , NOT_FOUND_WORKOUT("WORKOUT", 12100, "존재하지 않는 운동 기록입니다.")
    , FAILED_TO_SAVE_WORKOUT("WORKOUT", 12101, "운동 기록 저장에 실패했습니다.")
    , FAILED_TO_UPDATE_WORKOUT("WORKOUT", 12102, "운동 기록 수정에 실패했습니다.")
    , FAILED_TO_DELETE_WORKOUT("WORKOUT", 12103, "운동 기록 삭제에 실패했습니다.")

    , NOT_FOUND_ROUTINE("ROUTINE", 12200, "존재하지 않는 운동 루틴입니다.")
    , FAILED_TO_SAVE_ROUTINE("ROUTINE", 12201, "운동 루틴 저장에 실패했습니다.")
    , FAILED_TO_UPDATE_ROUTINE("ROUTINE", 12202, "운동 루틴 수정에 실패했습니다.")
    , FAILED_TO_DELETE_ROUTINE("ROUTINE", 12203, "운동 루틴 삭제에 실패했습니다.")

    , NOT_FOUND_ROUTINE_ITEM("ROUTINE_ITEM", 12300, "존재하지 않는 운동 루틴 항목입니다.")

    , NOT_FOUND_FOOD("FOOD", 13000, "존재하지 않는 음식입니다.")
    , FAILED_TO_SAVE_FOOD("FOOD", 13001, "음식 저장에 실패했습니다.")
    , FAILED_TO_UPDATE_FOOD("FOOD", 13002, "음식 수정에 실패했습니다.")
    , FAILED_TO_DELETE_FOOD("FOOD", 13003, "음식 삭제에 실패했습니다.")


    , NOT_FOUND_MEAL("MEAL", 13100, "존재하지 않는 식사 기록입니다.")
    , FAILED_TO_SAVE_MEAL("MEAL", 13101, "식사 저장에 실패했습니다.")
    , FAILED_TO_UPDATE_MEAL("MEAL", 13102, "식사 수정에 실패했습니다.")
    , FAILED_TO_DELETE_MEAL("MEAL", 13103, "식사 삭제에 실패했습니다.")

    , NOT_FOUND_MEAL_ITEM("MEAL_ITEM", 13200, "존재하지 않는 식사 항목입니다.")

    , FAQ_CATEGORY_DUPLICATE("FAQ_CATEGORY", 14000, "이미 존재하는 FAQ 카테고리입니다.")
    ;


    private final String domain;
    private final int code;
    private final String message;

    @Override
    public String toString() {
        return String.format("[%s-%s] %s", domain, code, message);
    }
} //!< 자동 정렬 하지마셈!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!