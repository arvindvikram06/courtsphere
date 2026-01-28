package com.courtsphere.courtsphere.DTO;

public record ApiResponse<T>(
        boolean success,
        String message,
        T data,
        long timestamp
) {
    public static <T> ApiResponse<T> success(String message, T data) {
        return new ApiResponse<>(true, message, data, System.currentTimeMillis());
    }
}

