package com.app.authservice.config;

import com.app.authservice.entity.Role;
import com.app.authservice.entity.RoleName;
import com.app.authservice.repository.RoleRepository;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

@Configuration
public class DataInitializer {

    @Bean
    CommandLineRunner initRoles(RoleRepository roleRepository) {
        return args -> {

            if (roleRepository.count() == 0) {
                roleRepository.save(new Role(RoleName.ADMIN));
                roleRepository.save(new Role(RoleName.BUYER));
                roleRepository.save(new Role(RoleName.SELLER));

                System.out.println("Roles created: ADMIN, BUYER, SELLER");
            }
        };
    }
}
