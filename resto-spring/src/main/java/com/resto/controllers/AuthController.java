// Controller untuk operasi otentikasi pengguna (signup dan login)

package com.resto.controllers;

import com.resto.dtos.AuthenticationRequest;
import com.resto.dtos.AuthenticationResponse;
import com.resto.dtos.SignupRequest;
import com.resto.dtos.UserDto;
import com.resto.entities.User;
import com.resto.repositories.UserRepository;
import com.resto.service.auth.AuthSevice;

import com.resto.service.jwt.UserService;
import com.resto.until.JwtUtil;
import jakarta.servlet.http.HttpServletResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.BadCredentialsException;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.io.IOException;
import java.util.Optional;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthSevice authSevice;
    private final AuthenticationManager authenticationManager;
    private final UserService userService;
    private final JwtUtil jwtUtil;
    private final UserRepository userRepository;

    public AuthController(AuthSevice authSevice, AuthenticationManager authenticationManager, UserService userService, JwtUtil jwtUtil, UserRepository userRepository) {
        this.authSevice = authSevice;
        this.authenticationManager = authenticationManager;
        this.userService = userService;
        this.jwtUtil = jwtUtil;
        this.userRepository = userRepository;
    }


    @PostMapping("/signup")
    public ResponseEntity<?> signUser(@RequestBody SignupRequest signupRequest) {
        UserDto createdUserDto = authSevice.createUser(signupRequest);

        if (createdUserDto == null){
            return new ResponseEntity<>("Buat akun terlebih dahulu", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<>(createdUserDto, HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> createAuthenticationToken(@RequestBody AuthenticationRequest authenticationRequest, HttpServletResponse response) throws IOException {
        try {
            authenticationManager.authenticate(new UsernamePasswordAuthenticationToken(authenticationRequest.getEmail(), authenticationRequest.getPassword()));
        } catch (BadCredentialsException e) {
            return new ResponseEntity<>("Username atau password salah", HttpStatus.UNAUTHORIZED);
        } catch (DisabledException e) {
            return new ResponseEntity<>("Akun tidak aktif", HttpStatus.UNAUTHORIZED);
        }

        final UserDetails userDetails = userService.UserDetailsService().loadUserByUsername(authenticationRequest.getEmail());
        final String jwt;
        try {
            jwt = jwtUtil.generateToken(userDetails);
        } catch (Exception e) {
            return new ResponseEntity<>("Gagal membuat token", HttpStatus.INTERNAL_SERVER_ERROR);
        }

        Optional<User> optionalUser = userRepository.findFirstByEmail(userDetails.getUsername());
        if (optionalUser.isPresent()) {
            AuthenticationResponse authenticationResponse = new AuthenticationResponse();
            authenticationResponse.setJwt(jwt);
            authenticationResponse.setUserRole(optionalUser.get().getUserRole());
            authenticationResponse.setUserId(optionalUser.get().getId());
            return ResponseEntity.ok(authenticationResponse);
        } else {
            return new ResponseEntity<>("Pengguna tidak ditemukan", HttpStatus.NOT_FOUND);
        }
    }


}
