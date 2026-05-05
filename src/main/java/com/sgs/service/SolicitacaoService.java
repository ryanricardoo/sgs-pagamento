package com.sgs.service;

import com.sgs.model.Solicitacao;
import com.sgs.model.StatusSolicitacao;
import com.sgs.repository.SolicitacaoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository repository;

    public List<Solicitacao> buscarPorDocumento(String documento){
        return repository.buscarCpfCnpj(documento);
    }

    @Transactional
    public Solicitacao criar(Solicitacao solicitacao){
        solicitacao.setStatus(StatusSolicitacao.SOLICITADO);
        return repository.save(solicitacao);
    }

    @Transactional
    public Solicitacao atualizarStatus(Long id, StatusSolicitacao novoStatus){
        Solicitacao solicitacaoExistente = repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada com id: " + id));

        if (solicitacaoExistente.getStatus().isFinal()){
            throw new IllegalStateException("Não é possível alterar uma solicitação com status final: "
                    + solicitacaoExistente.getStatus());
        }

        solicitacaoExistente.setStatus(novoStatus);
        return repository.save(solicitacaoExistente);
    }

}
