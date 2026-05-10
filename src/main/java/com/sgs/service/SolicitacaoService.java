package com.sgs.service;

import com.sgs.exception.ResourceNotFoundException;
import com.sgs.model.Solicitacao;
import com.sgs.model.StatusSolicitacao;
import com.sgs.repository.SolicitacaoRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository repository;

    public List<Solicitacao> buscarPorDocumento(String documento){
        return repository.buscarCpfCnpj(documento);
    }


    public Solicitacao buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada com id: " + id));
    }

    @Transactional
    public Solicitacao criar(Solicitacao solicitacao){
        solicitacao.setStatus(StatusSolicitacao.SOLICITADO);
        solicitacao.setDataSolicitacao(LocalDateTime.now());
        return repository.save(solicitacao);
    }

    @Transactional
    public Solicitacao atualizarStatus(Long id, StatusSolicitacao novoStatus){
        Solicitacao solicitacao = repository.findById(id)
                .orElseThrow(() -> new ResourceNotFoundException(id));

        StatusSolicitacao statusAtual = solicitacao.getStatus();

        if (statusAtual.isFinal()){
            throw new IllegalStateException("Não é possível alterar uma solicitação com status: " + statusAtual);

        }

        boolean transicaoValida = false;
        switch (statusAtual){
            case SOLICITADO:
                if (novoStatus == StatusSolicitacao.LIBERADO || novoStatus == StatusSolicitacao.REJEITADO){
                    transicaoValida = true;
                }
                break;

            case LIBERADO:
                if (novoStatus == StatusSolicitacao.APROVADO || novoStatus == StatusSolicitacao.REJEITADO){
                    transicaoValida = true;
                }
                break;

            case APROVADO:
                if (novoStatus == StatusSolicitacao.CANCELADO){
                    transicaoValida = true;
                }
                break;

            default:
                transicaoValida = false;
        }
        if (!transicaoValida){
            throw new IllegalStateException("Transição de status não permitida: " + statusAtual + " -> " + novoStatus);
        }

        solicitacao.setStatus(novoStatus);
        return repository.save(solicitacao);
    }

}
