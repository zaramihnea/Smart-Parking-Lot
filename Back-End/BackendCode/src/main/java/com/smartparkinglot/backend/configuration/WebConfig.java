package com.smartparkinglot.backend.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;

import java.sql.Timestamp;
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.format.DateTimeParseException;

@Configuration
public class WebConfig implements WebMvcConfigurer {
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(String.class, Timestamp.class, new StringToTimestampConverter());
    }

    static class StringToTimestampConverter implements Converter<String, Timestamp> {
        @Override
        public Timestamp convert(String source) {
            try {
                ZonedDateTime dateTime = ZonedDateTime.parse(source, DateTimeFormatter.ISO_DATE_TIME);
                // Adjust the ZonedDateTime by subtracting 3 hours to treat it as UTC+3
                ZonedDateTime adjustedDateTime = dateTime.minusHours(3);
                return Timestamp.from(adjustedDateTime.toInstant());
            } catch (DateTimeParseException e) {
                System.err.println("Failed to parse date: " + source);
                return null;
            }
        }
    }
    @Override
    public void addCorsMappings(CorsRegistry registry) {
        registry.addMapping("/**")
                .allowedOrigins("*")
                .allowedMethods("GET", "POST", "PUT", "DELETE", "OPTIONS")
                .allowedHeaders("*")
                .allowCredentials(true);
    }
}
}
