package com.innosync;

import org.junit.jupiter.api.Test;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.context.annotation.Import;
import org.springframework.test.context.ActiveProfiles;

@SpringBootTest
@ActiveProfiles("test")
@Import(com.innosync.config.TestContainersConfig.class)
class BackendApplicationTests {

	@Test
	void contextLoads() {
		// This test will pass if the application context loads successfully
		// It's a basic smoke test to ensure there are no major configuration issues
	}
}
