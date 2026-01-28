package com.courtsphere.courtsphere.exception;


import com.courtsphere.courtsphere.DTO.ApiError;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.AuthenticationException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {


       @ExceptionHandler(UsernameAlreadyExistsException.class)
        public ResponseEntity<ApiError> handleUserNameExists(UsernameAlreadyExistsException ex){
           ApiError apiError =  new ApiError(
                                HttpStatus.BAD_REQUEST.value(),
                                ex.getMessage(),
                   System.currentTimeMillis());

           return ResponseEntity.status(HttpStatus.BAD_REQUEST)
                   .body(apiError);
       }


       @ExceptionHandler(InvalidCredentialsException.class)
        public ResponseEntity<ApiError> handleInvalidCredentials(InvalidCredentialsException ex) {
           ApiError apiError = new ApiError(
                   HttpStatus.UNAUTHORIZED.value(),
                   ex.getMessage(),
                   System.currentTimeMillis());

           return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                   .body(apiError);
       }


    @ExceptionHandler(AuthenticationException.class)
    public ResponseEntity<ApiError> handleAuthException(AuthenticationException ex) {

        ApiError error = new ApiError(
                HttpStatus.UNAUTHORIZED.value(),
                "invalid username or password",
                System.currentTimeMillis());

        return ResponseEntity
                .status(HttpStatus.UNAUTHORIZED)
                .contentType(MediaType.APPLICATION_JSON)
                .body(error);
    }


    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiError> handleGenericException(Exception ex){
        ApiError apiError = new ApiError(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "unexpected error occurred",
                System.currentTimeMillis());

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(apiError);
    }

}


