package com.example.oct28.finalproject.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.config.annotation.web.builders.HttpSecurity;
import org.springframework.security.web.SecurityFilterChain;

@Configuration
public class SecurityConfig {

    @Bean
    public SecurityFilterChain securityFilterChain(HttpSecurity http) throws Exception {

        http
            .cors() // enable CORS (MUST MATCH your WebConfig)
            .and()
            .csrf().disable() // disable CSRF for APIs
            .authorizeHttpRequests(auth -> auth
                .requestMatchers("/api/**").permitAll() // allow all API calls for now
                .anyRequest().permitAll()
            )
            .formLogin().disable()
            .httpBasic().disable();

        return http.build();
    }
}
