package com.example.oct28.finalproject.config;

import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

@Configuration
public class WebConfig {
    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurer() {
          @Override
          public void addCorsMappings(CorsRegistry registry) {
            // Accept dev frontends. In production lock this down to the real domain(s).
            registry.addMapping("/api/**")
                    .allowedOriginPatterns(
                        "http://localhost:5173",
                        "http://127.0.0.1:5173",
                        "http://localhost:3000",
                        "http://127.0.0.1:3000"
                    )
                    .allowedMethods("GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .exposedHeaders("Authorization", "Content-Disposition") // optional
                    .allowCredentials(true)
                    .maxAge(3600L);

            // === ADDED: allow frontend to call /exports/** (your CSV endpoints)
            registry.addMapping("/exports/**")
                    .allowedOriginPatterns(
                        "http://localhost:5173",
                        "http://127.0.0.1:5173",
                        "http://localhost:3000",
                        "http://127.0.0.1:3000"
                    )
                    .allowedMethods("GET", "POST", "DELETE", "OPTIONS")
                    .allowedHeaders("*")
                    .exposedHeaders("Content-Disposition")
                    .allowCredentials(true)
                    .maxAge(3600L);

            // If you serve uploaded static files from /uploads, allow browser to request them too:
            registry.addMapping("/uploads/**")
                    .allowedOriginPatterns("*")
                    .allowedMethods("GET", "OPTIONS")
                    .allowedHeaders("*")
                    .allowCredentials(false)
                    .maxAge(3600L);
          }
        };
    }
}
