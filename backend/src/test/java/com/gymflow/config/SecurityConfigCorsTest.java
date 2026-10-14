package com.gymflow.config;

import static org.junit.jupiter.api.Assertions.assertTrue;
import static org.mockito.Mockito.mock;

import org.junit.jupiter.api.Test;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.cors.CorsConfiguration;
import org.springframework.web.cors.CorsConfigurationSource;

import com.gymflow.service.GymUserDetailsService;

class SecurityConfigCorsTest {

	@Test
	void allowsProductionVercelAndLocalOrigins() {
		SecurityConfig config = new SecurityConfig(
				mock(JwtAuthenticationFilter.class),
				mock(GymUserDetailsService.class),
				"https://gym-flow-tawny.vercel.app");

		CorsConfigurationSource source = config.corsConfigurationSource();
		CorsConfiguration cors = source.getCorsConfiguration(
				new MockHttpServletRequest("OPTIONS", "/api/auth/login"));

		assertTrue(cors.getAllowedOriginPatterns().contains("https://gym-flow-tawny.vercel.app"));
		assertTrue(cors.getAllowedOriginPatterns().contains("https://*.vercel.app"));
		assertTrue(cors.getAllowedOriginPatterns().contains("http://localhost:*"));
		assertTrue(cors.getAllowedMethods().contains("OPTIONS"));
	}
}
