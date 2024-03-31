package com.resto.service.auth;

import com.resto.dtos.SignupRequest;
import com.resto.dtos.UserDto;
// Antar muka untuk layanan otentikasi

public interface AuthSevice {
    UserDto createUser(SignupRequest signupRequest);
}
