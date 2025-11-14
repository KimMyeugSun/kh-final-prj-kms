package com.kh.team119.security;

import com.kh.team119.authentication.SecurityAuthVo;
import com.kh.team119.roletype.RoleType;
import lombok.RequiredArgsConstructor;
import lombok.ToString;
import org.springframework.security.core.GrantedAuthority;
import org.springframework.security.core.authority.SimpleGrantedAuthority;
import org.springframework.security.core.userdetails.UserDetails;

import java.util.Collection;
import java.util.List;

@RequiredArgsConstructor
@ToString
public class SecurityUserDetails implements UserDetails {
    private final SecurityAuthVo vo;

    @Override
    public Collection<? extends GrantedAuthority> getAuthorities() {
        return vo.getRoles()
                .stream()
                .map(x -> {
                    return new SimpleGrantedAuthority("ROLE_" + x.name());
                })
                .toList();
    }

    @Override
    public String getPassword() { return vo.getPassword(); }

    @Override
    public String getUsername() { return vo.getId(); }

    public String getUserNick() {
        return vo.getName();
    }

    public List<RoleType> getUserRole() {
        return vo.getRoles();
    }
}
