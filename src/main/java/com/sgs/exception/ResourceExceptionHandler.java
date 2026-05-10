package com.sgs.exception;

import jakarta.servlet.http.HttpServletRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ControllerAdvice;
import org.springframework.web.bind.annotation.ExceptionHandler;

@ControllerAdvice
public class ResourceExceptionHandler {

    @ExceptionHandler(IllegalStateException.class)
    public ResponseEntity<StandardError> illegalState(IllegalStateException e, HttpServletRequest request){
        StandardError err = new StandardError(
                HttpStatus.BAD_REQUEST.value(),
                e.getMessage(),
                System.currentTimeMillis()
        );
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(err);
    }

    @ExceptionHandler(RuntimeException.class)
    public ResponseEntity<StandardError> runtime(RuntimeException e, HttpServletRequest request) {
        StandardError err = new StandardError(
                HttpStatus.INTERNAL_SERVER_ERROR.value(),
                "Error inesperado no servidor",
                System.currentTimeMillis()
                );
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(err);
    }

    @ExceptionHandler(ResourceNotFoundException.class)
    public ResponseEntity<StandardError> resourceNotFound(ResourceNotFoundException e, HttpServletRequest request){
        StandardError err = new StandardError(
                HttpStatus.NOT_FOUND.value(),
                e.getMessage(),
                System.currentTimeMillis()
        );
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(err);
    }
}

