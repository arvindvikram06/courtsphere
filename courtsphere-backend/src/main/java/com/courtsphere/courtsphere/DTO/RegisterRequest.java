package com.courtsphere.courtsphere.DTO;


import com.courtsphere.courtsphere.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    private String username;
    private String password;
    private Role role;




}
