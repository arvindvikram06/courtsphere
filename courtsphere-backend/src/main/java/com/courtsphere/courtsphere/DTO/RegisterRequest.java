package com.courtsphere.courtsphere.DTO;


import com.courtsphere.courtsphere.entity.Role;
import lombok.Data;

@Data
public class RegisterRequest {

    private String aadharId;
    private String password;
    private String username;
    private Role role;




}
