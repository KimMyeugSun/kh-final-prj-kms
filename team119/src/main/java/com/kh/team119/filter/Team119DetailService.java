package com.kh.team119.filter;

import com.kh.team119.authentication.SecurityAuthVo;
import com.kh.team119.employee.repository.EmployeeRepository;
import com.kh.team119.security.SecurityUserDetails;
import jakarta.transaction.Transactional;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;

@Service
@Transactional
@RequiredArgsConstructor
public class Team119DetailService implements UserDetailsService {
    private final EmployeeRepository empRepository;

    @Override
    public UserDetails loadUserByUsername(String empId) throws UsernameNotFoundException {
        var entity = empRepository.findByEmpId(empId);

        if (entity == null) {
            throw new UsernameNotFoundException("");
        }
        return new SecurityUserDetails(SecurityAuthVo.from(entity));
    }
}
