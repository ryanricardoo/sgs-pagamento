package com.sgs.exception;

public class ResourceNotFoundException extends RuntimeException{
    public ResourceNotFoundException(Object id){
        super("Rescurso não encontrado. ID: " + id);
    }
}
