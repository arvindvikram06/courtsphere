package com.courtsphere.courtsphere.controller;


import com.courtsphere.courtsphere.DTO.LoginRequest;
import com.courtsphere.courtsphere.config.UserPrincipal;
import com.courtsphere.courtsphere.jwt.JwtUtils;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/auth")
public class AuthController {
        private final AuthenticationManager authManager;

        private final JwtUtils jwtUtils;


        public AuthController(AuthenticationManager authManager,JwtUtils jwtUtils){
              this.authManager = authManager;
              this.jwtUtils = jwtUtils;
        }

    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest req) {

        System.out.println("LOGIN HIT");

//        System.out.println("USERNAME FROM REQUEST = [" + req.getUsername() + "]");
//        System.out.println("PASSWORD FROM REQUEST = [" + req.getPassword() + "]");

        try {
            Authentication auth = authManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            req.getUsername(),
                            req.getPassword()
                    )
            );
            System.out.println("after authmanager call");
            UserPrincipal principal = (UserPrincipal) auth.getPrincipal();
            String token = jwtUtils.generateToken(principal);

            return ResponseEntity.ok(token);

        } catch (AuthenticationException ex) {

            return ResponseEntity
                    .status(HttpStatus.UNAUTHORIZED)
                    .body("Invalid username or password");
        }
    }

}
