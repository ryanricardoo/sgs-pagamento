package com.sgs.exception;

public record StandardError(Integer status, String message, Long timestamp)  { }
