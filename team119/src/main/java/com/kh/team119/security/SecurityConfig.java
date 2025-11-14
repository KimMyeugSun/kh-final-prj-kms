package com.kh.team119.security;

import com.kh.team119.filter.JwtFilter;
import com.kh.team119.filter.AuthenticationFilter;
import com.kh.team119.filter.Team119DetailService;
import com.kh.team119.security.refresh.token.RefreshTokenService;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.authentication.configuration.AuthenticationConfiguration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.configuration.EnableWebSecurity;
import org.springframework.security.config.annotation.web.configurers.AbstractHttpConfigurer;
import org.springframework.security.config.http.SessionCreationPolicy;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.SecurityFilterChain;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.security.web.authentication.UsernamePasswordAuthenticationFilter;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;
import org.springframework.web.cors.CorsUtils;
import org.springframework.web.cors.UrlBasedCorsConfigurationSource;

import java.util.List;

@Configuration
@EnableWebSecurity
@RequiredArgsConstructor
public class SecurityConfig {
    private final AuthenticationConfiguration authConfig;
    private final SecurityJwtUtil jwtUtil;
    private final Team119DetailService DetailsService;
    private final RefreshTokenService refreshTokenService;

    @Value("${SECURITY.MANAGEMENT.REQUEST.ONLY.ADMIN.MATCHERS}")
    private String[] adminOnlyMatchers;
    @Value("${SECURITY.MANAGEMENT.REQUEST.PERMIT_ALL.MATCHERS}")
    private String[] managementPermitAllMatchers;
    @Value("${SECURITY.USER.REQUEST.PERMIT_ALL.MATCHERS}")
    private String[] userPermitAllMatchers;

    @Bean
    public AuthenticationManager getAuthenticationManger() throws Exception {
        return authConfig.getAuthenticationManager();
    }

    @Bean
    public PasswordEncoder bCryptPasswordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Bean
    public AccessDeniedHandler restAccessDeniedHandler() {
        return new RestAccessDeniedHandler();
    }

    @Bean
    public AuthenticationEntryPoint restAuthenticationEntryPoint() {
        return new RestAuthenticationEntryPoint();
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider provider = new DaoAuthenticationProvider();
        provider.setUserDetailsService(DetailsService);
        provider.setPasswordEncoder(bCryptPasswordEncoder());
        provider.setHideUserNotFoundExceptions(false); // UsernameNotFoundException 노출
        return provider;
    }

    public void configure(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(daoAuthenticationProvider());
    }
//        configuration.setAllowedOrigins(List.of("http://localhost", "http://127.0.0.1", "http://localhost:80", "http://127.0.0.1:80", "http://localhost:8080", "http://127.0.0.1:8080"));

    @Bean
    public CorsConfigurationSource corsConfigurationSource() {
        CorsConfiguration configuration = new CorsConfiguration();
        configuration.setAllowedOriginPatterns(List.of("*"));
        configuration.setAllowedMethods(List.of("GET", "POST", "PUT", "DELETE", "OPTIONS"));
        configuration.setAllowedHeaders(List.of("*"));
        configuration.setExposedHeaders(List.of("*"));
        configuration.setAllowCredentials(true);

        UrlBasedCorsConfigurationSource source = new UrlBasedCorsConfigurationSource();
        source.registerCorsConfiguration("/**", configuration);
        return source;
    }

    @Bean
    @Order(1)
    public SecurityFilterChain managementSecurityFilterChain(HttpSecurity hs) throws Exception {
        hs.formLogin(AbstractHttpConfigurer::disable);
        hs.csrf(AbstractHttpConfigurer::disable);
        hs.httpBasic(AbstractHttpConfigurer::disable);
        hs.sessionManagement(x -> x.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        hs.securityMatcher("/management/**");
        hs.cors(corsConfigurer -> corsConfigurer.configurationSource(corsConfigurationSource()));
        hs.authorizeHttpRequests(x -> x
                .requestMatchers("/notification/**").permitAll()
                .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
                .requestMatchers(managementPermitAllMatchers).permitAll()//!< 누구나 접근 허용
                .requestMatchers(adminOnlyMatchers).hasAnyRole("ADMIN")//!< ADMIN 전용
                .requestMatchers("/management/api/noticeboard/register/**").hasAnyRole("ADMIN", "MANAGER")
                .requestMatchers("/management/**").hasAnyRole("ADMIN", "MANAGER")
                .anyRequest().authenticated()//!< 관리자 페이지는 권한이 있는 사용자만 접근 허용
        );
        hs.exceptionHandling(x -> x
                .authenticationEntryPoint(restAuthenticationEntryPoint())
                .accessDeniedHandler(restAccessDeniedHandler())
        );
        JwtFilter jwtFilter = new JwtFilter(jwtUtil);
        hs.addFilterBefore(jwtFilter, AuthenticationFilter.class);
        var authMgr = getAuthenticationManger();
        var authFilter = new AuthenticationFilter(authMgr, jwtUtil, refreshTokenService);
        authFilter.setFilterProcessesUrl("/management/sign-in");
        hs.addFilterAt(authFilter, UsernamePasswordAuthenticationFilter.class);

        return hs.build();
    }

    @Bean
    @Order(2)
    public SecurityFilterChain securityFilterChain(HttpSecurity hs) throws Exception {
        hs.formLogin(AbstractHttpConfigurer::disable);
        hs.csrf(AbstractHttpConfigurer::disable);
        hs.httpBasic(AbstractHttpConfigurer::disable);
        hs.sessionManagement(x -> x.sessionCreationPolicy(SessionCreationPolicy.STATELESS));
        hs.securityMatcher("/**");
        hs.cors(corsConfigurer -> corsConfigurer.configurationSource(corsConfigurationSource()));
        hs.authorizeHttpRequests(x -> x
                .requestMatchers("/swagger-ui/**", "/v3/api-docs/**", "/swagger-ui.html").permitAll() // 명시적 허용
                .requestMatchers("/notification/**").permitAll()
                .requestMatchers(CorsUtils::isPreFlightRequest).permitAll()
                .requestMatchers(userPermitAllMatchers).permitAll()//!< 누구나 접근 허용
                .requestMatchers("/**").hasAnyRole("USER", "MANAGER", "ADMIN") //!< USER, MANAGER, ADMIN 권한이 있는 사용자만 접근 허용
                .anyRequest().authenticated()//!< 나머지 요청은 인증된 사용자만 접근 허용
        );
        hs.exceptionHandling(ex -> ex
                .authenticationEntryPoint(restAuthenticationEntryPoint())
                .accessDeniedHandler(restAccessDeniedHandler())
        );

        //!< 필터 추가 (로그인필터 previous)
        JwtFilter jwtFilter = new JwtFilter(jwtUtil);
        hs.addFilterBefore(jwtFilter, AuthenticationFilter.class);

        var authMgr = getAuthenticationManger();
        var signInFilter = new AuthenticationFilter(authMgr, jwtUtil, refreshTokenService);
        signInFilter.setFilterProcessesUrl("/sign-in");
        //!< 필터 교체 (UsernamePasswordAuthenticationFilter -> signInFilter)
        hs.addFilterAt(signInFilter, UsernamePasswordAuthenticationFilter.class);

        //!< cors 설정
        return hs.build();
    }
}
