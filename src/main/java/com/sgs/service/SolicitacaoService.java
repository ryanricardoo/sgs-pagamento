package com.sgs.service;

import com.sgs.dto.SolicitacaoDTO;
import com.sgs.exception.ResourceNotFoundException;
import com.sgs.model.Categoria;
import com.sgs.model.Solicitacao;
import com.sgs.model.Solicitante;
import com.sgs.model.StatusSolicitacao;
import com.sgs.repository.CategoriaRepository;
import com.sgs.repository.SolicitacaoRepository;
import com.sgs.repository.SolicitanteRepository;
import jakarta.transaction.Transactional;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SolicitacaoService {

    @Autowired
    private SolicitacaoRepository repository;

    @Autowired
    private SolicitanteRepository solicitanteRepository;

    @Autowired
    private CategoriaRepository categoriaRepository;

    public List<SolicitacaoDTO> listarTodos(String status, Long categoriaId, LocalDateTime inicio, LocalDateTime fim) {
        return repository.listarFiltros(status, categoriaId, inicio, fim)
                .stream()
                .map(p -> new SolicitacaoDTO(
                        p.getId(),
                        p.getNomeSolicitante(),
                        p.getDocumento(),
                        p.getNomeCategoria(),
                        p.getDescricao(),
                        p.getValor(),
                        p.getDataSolicitacao(),
                        StatusSolicitacao.valueOf(p.getStatus())
                ))
                        .toList();
    }

    public Solicitacao buscarPorId(Long id) {
        return repository.findById(id)
                .orElseThrow(() -> new RuntimeException("Solicitação não encontrada com id: " + id));
    }

    @Transactional
    public Solicitacao criar(Solicitacao solicitacao, Long solicitanteId, Long categoriaId){
        Solicitante solicitante = solicitanteRepository.findById(solicitanteId)
                        .orElseThrow(() -> new RuntimeException("Solicitante inexistente."));
        Categoria categoria = categoriaRepository.findById(categoriaId)
                        .orElseThrow(() -> new RuntimeException("Categoria inexistente"));
        solicitacao.setSolicitante(solicitante);
        solicitacao.setCategoria(categoria);
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
