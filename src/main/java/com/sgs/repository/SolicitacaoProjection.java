package com.sgs.repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public interface SolicitacaoProjection {
    Long getId();
    String getNomeSolicitante();
    String getDocumento();
    String getNomeCategoria();
    String getDescricao();
    BigDecimal getValor();
    LocalDateTime getDataSolicitacao();
    String getStatus();
}
