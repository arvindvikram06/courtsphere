package com.courtsphere.courtsphere.controller;

import com.courtsphere.courtsphere.DTO.RegisterRequest;
import com.courtsphere.courtsphere.entity.User;
import com.courtsphere.courtsphere.exception.UsernameAlreadyExistsException;
import com.courtsphere.courtsphere.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;

@Service
public class AuthService {


    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;


    public AuthService(UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }


    public void register(RegisterRequest req) {

            if(userRepository.existsByUserName(req.getUsername())){
                throw new UsernameAlreadyExistsException("Username already taken");
            }

            User user = new User();
            user.setUserName(req.getUsername());
            user.setPassword(passwordEncoder.encode(req.getPassword()));
            user.setRole(req.getRole());
            user.setEnabled(true);

            userRepository.save(user);

    }
}
