package com.sgs.model;

public enum StatusSolicitacao {
    SOLICITADO,
    LIBERADO,
    APROVADO,
    REJEITADO,
    CANCELADO;

    public boolean isFinal(){
        return this == REJEITADO || this == CANCELADO;
    }
}
