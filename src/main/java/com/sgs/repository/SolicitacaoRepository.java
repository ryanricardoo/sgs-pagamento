package com.sgs.repository;

import com.sgs.model.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    @Query(value = "SELECT s.id, " +
            "sol.nome AS nomeSolicitante, " +
            "sol.cpf_cnpj AS documento, " +
            "cat.nome AS nomeCategoria, " +
            "s.descricao, " +
            "s.valor, " +
            "s.data_solicitacao AS dataSolicitacao, " +
            "s.status " +
            "FROM tb_solicitacao s " +
            "INNER JOIN tb_solicitante sol ON s.solicitante_id = sol.id " +
            "INNER JOIN tb_categoria cat ON s.categoria_id = cat.id " +
            "WHERE (:status IS NULL OR s.status = :status) " +
            "AND (:categoriaId IS NULL OR cat.id = :categoriaId) " +
            "AND (CAST(:dataInicio AS TIMESTAMP) IS NULL OR s.data_solicitacao >= :dataInicio) " +
            "AND (CAST(:dataFim AS TIMESTAMP) IS NULL OR s.data_solicitacao <= :dataFim) ",
            nativeQuery = true)
    List<SolicitacaoProjection> listarFiltros(
            @Param("status") String status,
            @Param("categoriaId") Long categoriaId,
            @Param("dataInicio")LocalDateTime dataInicio,
            @Param("dataFim") LocalDateTime dateFim
    );

}
