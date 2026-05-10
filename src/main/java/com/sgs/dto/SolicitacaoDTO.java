package com.sgs.dto;

import com.sgs.model.Solicitacao;
import com.sgs.model.StatusSolicitacao;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record SolicitacaoDTO(
    Long id,
    String nomeSolicitante,
    String descricao,
    BigDecimal valor,
    LocalDateTime dataSolicitacao,
    StatusSolicitacao status
    ){
    public SolicitacaoDTO(Solicitacao entity){
        this(
                entity.getId(),
                entity.getSolicitante().getNome(),
                entity.getDescricao(),
                entity.getValor(),
                entity.getDataSolicitacao(),
                entity.getStatus()
        );
    }
}
