package com.courtsphere.courtsphere.DTO;

import lombok.Data;

@Data
public class LoginRequest {
    private String aadharId;
    private String password;
}
