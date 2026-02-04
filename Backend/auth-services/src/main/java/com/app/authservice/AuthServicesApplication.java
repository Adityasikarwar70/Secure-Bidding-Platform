package com.app.authservice;


import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.security.config.annotation.method.configuration.EnableMethodSecurity;
@EnableMethodSecurity
@SpringBootApplication(scanBasePackages = "com.app")
public class AuthServicesApplication {

	public static void main(String[] args) {
		SpringApplication.run(AuthServicesApplication.class, args);
	}

}
