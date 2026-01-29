package com.courtsphere.courtsphere.DTO;





public record ApiError(
     int status,
     String message,
     long timestamp
){ }
