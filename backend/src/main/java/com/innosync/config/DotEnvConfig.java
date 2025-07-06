package com.innosync.config;

import io.github.cdimascio.dotenv.Dotenv;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContextInitializer;
import org.springframework.context.ConfigurableApplicationContext;
import org.springframework.core.env.ConfigurableEnvironment;
import org.springframework.core.env.MapPropertySource;

import java.util.HashMap;
import java.util.Map;

public class DotEnvConfig implements ApplicationContextInitializer<ConfigurableApplicationContext> {

    private static final Logger logger = LoggerFactory.getLogger(DotEnvConfig.class);

    @Override
    public void initialize(ConfigurableApplicationContext applicationContext) {
        ConfigurableEnvironment environment = applicationContext.getEnvironment();
        
        try {
            logger.info("Loading .env file...");
            Dotenv dotenv = Dotenv.configure()
                    .directory(".")
                    .ignoreIfMalformed()
                    .ignoreIfMissing()
                    .load();

            Map<String, Object> envMap = new HashMap<>();
            dotenv.entries().forEach(entry -> {
                envMap.put(entry.getKey(), entry.getValue());
                logger.debug("Loaded env var: {} = {}", entry.getKey(), entry.getValue());
            });

            if (!envMap.isEmpty()) {
                environment.getPropertySources().addFirst(new MapPropertySource("dotenv", envMap));
                logger.info("Successfully loaded {} environment variables", envMap.size());
            } else {
                logger.warn("No environment variables found in .env file");
            }

        } catch (Exception e) {
            logger.error("Could not load .env file: {}", e.getMessage(), e);
        }
    }
} 