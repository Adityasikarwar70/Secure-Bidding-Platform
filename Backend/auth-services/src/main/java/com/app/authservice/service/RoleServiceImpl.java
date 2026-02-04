package com.app.authservice.service;

import com.app.authservice.entity.Role;
import com.app.authservice.entity.RoleName;
import com.app.authservice.repository.RoleRepository;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class RoleServiceImpl implements RoleService {

    private final RoleRepository roleRepository;

    public RoleServiceImpl(RoleRepository roleRepository) {
        this.roleRepository = roleRepository;
    }

    @Override
    public Role saveRole(Role role) {
        return roleRepository.save(role);
    }

    @Override
    public Optional<Role> getRoleByName(RoleName roleName) {
        return roleRepository.findByName(roleName);
    }

    @Override
    public List<Role> getAllRoles() {
        return roleRepository.findAll();
    }
}
