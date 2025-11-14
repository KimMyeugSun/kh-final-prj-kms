package com.kh.team119.common.validate;

public class Validate {
    public static boolean ID(String id){
        if (id == null || id.isEmpty())
            return false;

        return id.matches("^[a-zA-Z0-9]{2,20}$");
    }

    public static boolean PASSWORD(String password){
        if (password == null) return false;

        return true;
        //!< 나중에 풀어주자 걸어두면 불편쓰
//        boolean len = password.matches("^.{4,20}$"); //!< 4~20자
//        boolean hasUpper = password.matches(".*[A-Z].*"); //!< 대문자
//        boolean hasLower = password.matches(".*[a-z].*"); //!< 소문자
//        boolean hasDigit = password.matches(".*[0-9].*"); //!< 숫자
//        boolean hasSpecial = password.matches(".*[^a-zA-Z0-9].*"); //!< 특수문자
//        return len && hasUpper && hasLower && hasDigit && hasSpecial;
    }
}