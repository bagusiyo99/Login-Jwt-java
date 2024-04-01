package com.resto.service.auth;

import com.resto.dtos.SignupRequest;
import com.resto.dtos.UserDto;
import com.resto.entities.User;
import com.resto.enums.UserRole;
import com.resto.repositories.UserRepository;
import com.resto.service.auth.AuthSevice;
import jakarta.annotation.PostConstruct;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

// Implementasi layanan otentikasi untuk membuat pengguna baru

@Service
public class AuthSeviceImplementation implements AuthSevice {

    private final UserRepository userRepository;

    public AuthSeviceImplementation(UserRepository userRepository) {
        this.userRepository = userRepository;
    }

    @PostConstruct
    public void createAdminAccount(){
        User adminAccount = userRepository.findByUserRole(UserRole.ADMIN);
        if (adminAccount == null){
            User user = new User();
            user.setName("admin");
            user.setEmail("admin@test.com");
            user.setPassword(new BCryptPasswordEncoder().encode("admin"));
            user.setUserRole(UserRole.ADMIN);
            userRepository.save(user);
        }
    }
    // Membuat DTO untuk pengguna yang dibuat
    @Override
    public UserDto createUser(SignupRequest signupRequest) {
        User user = new User();
        user.setName(signupRequest.getName());
        user.setEmail(signupRequest.getEmail());
        user.setPassword(new BCryptPasswordEncoder().encode(signupRequest.getPassword()));
        user.setUserRole(UserRole.CUSTOMER);
        User createUser = userRepository.save(user);
        UserDto createdUserDto = new UserDto();
        createdUserDto.setId(createUser.getId());
        createdUserDto.setName(createUser.getName());
        createdUserDto.setEmail(createUser.getEmail());
        createdUserDto.setUserRole(createUser.getUserRole());

        return createdUserDto;
    }
}
