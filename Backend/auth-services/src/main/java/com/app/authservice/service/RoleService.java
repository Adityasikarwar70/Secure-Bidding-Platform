package com.app.authservice.service;

import com.app.authservice.entity.Role;
import com.app.authservice.entity.RoleName;

import java.util.List;
import java.util.Optional;

public interface RoleService {

    Role saveRole(Role role);

    Optional<Role> getRoleByName(RoleName roleName);

    List<Role> getAllRoles();
}
