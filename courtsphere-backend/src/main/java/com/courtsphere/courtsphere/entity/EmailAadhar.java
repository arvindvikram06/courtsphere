package com.courtsphere.courtsphere.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

@Entity
@Table(name = "emailaadhar")
public class EmailAadhar {

    @Id
    @Column(length = 12)
    private String aadharId;

    @Column(nullable = false, unique = true)
    private String email;
}
