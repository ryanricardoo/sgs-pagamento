package com.sgs.exception;

import java.util.ArrayList;
import java.util.List;

public class ValidationError extends StandardError{
    private final List<FieldMessage> errors = new ArrayList<>();

    public ValidationError(Integer status, String message, Long timestamp){
        super(status, message, timestamp);
    }

    public List<FieldMessage> getErrors(){
        return errors;
    }

    public void addError(String fieldName, String message){
        errors.add(new FieldMessage(fieldName, message));
    }
}
