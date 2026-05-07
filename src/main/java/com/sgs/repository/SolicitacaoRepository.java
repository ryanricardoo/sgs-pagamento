package com.sgs.repository;

import com.sgs.model.Solicitacao;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SolicitacaoRepository extends JpaRepository<Solicitacao, Long> {

    @Query(value = "SELECT s.* FROM tb_solicitacao s " +
            "INNER JOIN tb_solicitante sol ON s.solicitante_id = sol.id " +
            "WHERE sol.cpf_cnpj = :documento",
            nativeQuery = true)
    List<Solicitacao> buscarCpfCnpj(@Param("documento") String documento);
}
