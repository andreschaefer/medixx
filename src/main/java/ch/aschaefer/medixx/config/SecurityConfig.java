/*
 * Copyright 2000-2014 Namics AG. All rights reserved.
 */

package ch.aschaefer.medixx.config;

import ch.aschaefer.medixx.model.user.Role;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.core.Ordered;
import org.springframework.core.annotation.Order;
import org.springframework.security.authentication.dao.DaoAuthenticationProvider;
import org.springframework.security.config.annotation.authentication.builders.AuthenticationManagerBuilder;
import org.springframework.security.config.annotation.method.configuration.EnableGlobalMethodSecurity;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.config.annotation.web.builders.WebSecurity;
import org.springframework.security.config.annotation.web.configuration.WebSecurityConfigurerAdapter;
import org.springframework.security.config.annotation.web.servlet.configuration.EnableWebMvcSecurity;
import org.springframework.security.core.userdetails.UserDetailsService;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.security.web.util.matcher.AntPathRequestMatcher;

import javax.inject.Inject;

/**
 * SecurityConfig.
 *
 * @author lboesch, Namics AG
 * @since 24.03.14
 */
@Configuration
@EnableWebMvcSecurity
@EnableGlobalMethodSecurity(prePostEnabled = true)
@Order(Ordered.LOWEST_PRECEDENCE)
public class SecurityConfig extends WebSecurityConfigurerAdapter {

    public static final String MATCH_ALL_PATTERN = "/**";
    @Inject
    protected UserDetailsService userDetailsService;

    @Inject
    protected void configureUsers(AuthenticationManagerBuilder auth) throws Exception {
        auth.authenticationProvider(daoAuthenticationProvider());
    }

    @Bean
    public DaoAuthenticationProvider daoAuthenticationProvider() {
        DaoAuthenticationProvider daoAuthenticationProvider = new DaoAuthenticationProvider();
        daoAuthenticationProvider.setPasswordEncoder(passwordEncoder());
        daoAuthenticationProvider.setUserDetailsService(userDetailsService);
        return daoAuthenticationProvider;
    }

    @Bean
    public PasswordEncoder passwordEncoder() {
        return new BCryptPasswordEncoder();
    }

    @Configuration
    @Order(Ordered.LOWEST_PRECEDENCE - 1)
    public static class AdminWebSecurityConfigurationAdapter extends WebSecurityConfigurerAdapter {
        @Override
        protected void configure(HttpSecurity http) throws Exception {
            //			@formatter:off
            http
                    .csrf().disable()
                    .headers().frameOptions().cacheControl().disable()
                    .antMatcher(MATCH_ALL_PATTERN)
                    .authorizeRequests()
                    .antMatchers(
                            "/admin/logs",
                            "/admin/logs/**",
                            "/admin/monitoring",
                            "/admin/monitoring/**")
                    .hasAnyAuthority(Role.MEDIXX_SUPER_ADMIN.toString())
                    .antMatchers("/admin/**")
                    .hasAnyAuthority(Role.MEDIXX_ADMIN.toString(), Role.MEDIXX_SUPER_ADMIN.toString())
                    .antMatchers(MATCH_ALL_PATTERN)
                    .hasAnyAuthority(Role.MEDIXX_USER.toString())
                    .and()
                    .httpBasic()
                    .and()
                    .logout()
                    .logoutRequestMatcher(new AntPathRequestMatcher("/logout", "GET"))
                    .logoutSuccessUrl("/") // don't use permitAll on logout(), because access to successURL also gets set!
                    .and()
                    .exceptionHandling()
                    .accessDeniedPage("/error")
            ;
            //			@formatter:on
        }
    }

    @Override
    public void configure(WebSecurity web) throws Exception {
        web.ignoring().antMatchers("/echo/**", "/error/**", "/webjars/**");
    }
}
