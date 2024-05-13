package com.dobie.backend.exception.exception.build;

import com.dobie.backend.exception.format.response.ErrorCode;
import lombok.Getter;

@Getter
public class NginxConfDeleteFailedException extends RuntimeException {
    private final ErrorCode errorCode;
    private final String errorMessage;
    private final String errorDetail;

    public NginxConfDeleteFailedException(String errorMessage, String errorDetail) {
        this.errorCode = ErrorCode.NGINX_CONF_DELETE_FAILED;
        this.errorMessage = errorMessage;
        this.errorDetail = errorDetail;
    }
}
