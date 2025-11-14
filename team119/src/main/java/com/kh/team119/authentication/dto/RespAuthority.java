package com.kh.team119.authentication.dto;

import com.kh.team119.roletype.RoleType;
import lombok.Builder;
import lombok.Getter;

import java.util.List;

@Getter
@Builder
public class RespAuthority {
    private List<RoleType> role;
}
