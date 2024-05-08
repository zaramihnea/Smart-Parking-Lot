package com.smartparkinglot.backend.configuration;

import org.springframework.context.annotation.Configuration;
import org.springframework.core.convert.converter.Converter;
import org.springframework.format.FormatterRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import java.sql.Timestamp;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@Configuration
public class ConverterConfig implements WebMvcConfigurer {
    @Override
    public void addFormatters(FormatterRegistry registry) {
        registry.addConverter(String.class, Timestamp.class, new StringToTimestampConverter());
    }

    // method to convert String to Timestamp automatically
    static class StringToTimestampConverter implements Converter<String, Timestamp> {
        @Override
        public Timestamp convert(String source) {
            return Timestamp.valueOf(LocalDateTime.parse(source, DateTimeFormatter.ISO_DATE_TIME));
        }
    }
}