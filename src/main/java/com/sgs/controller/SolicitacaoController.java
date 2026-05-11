package com.sgs.controller;

import com.sgs.dto.SolicitacaoDTO;
import com.sgs.dto.SolicitacaoRequestDTO;
import com.sgs.model.Solicitacao;
import com.sgs.model.StatusSolicitacao;
import com.sgs.service.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoService service;

    @GetMapping("/busca")
    public ResponseEntity<List<SolicitacaoDTO>> buscarPorDocumento(@RequestParam String documento){
        List<Solicitacao> lista = service.buscarPorDocumento(documento);
        List<SolicitacaoDTO> dtos = lista.stream().map(SolicitacaoDTO::new).toList();
        return ResponseEntity.ok(dtos);
    }

    @GetMapping("/{id}")
    public ResponseEntity<SolicitacaoDTO> buscarPorId(@PathVariable Long id){
        Solicitacao obj = service.buscarPorId(id);
        return ResponseEntity.ok(new SolicitacaoDTO(obj));
    }

    @PostMapping
    public ResponseEntity<SolicitacaoDTO> criar(@Valid @RequestBody SolicitacaoRequestDTO dto){
        Solicitacao novaSolicitacao = new Solicitacao();
        novaSolicitacao.setDescricao(dto.descricao());
        novaSolicitacao.setValor(dto.valor());

        Solicitacao salva = service.criar(novaSolicitacao, dto.solicitanteId(), dto.categoriaId());
        return ResponseEntity.status(HttpStatus.CREATED).body(new SolicitacaoDTO(salva));
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<SolicitacaoDTO> atualizarStatus(
            @PathVariable Long id,
            @RequestParam StatusSolicitacao novoStatus){

        Solicitacao atualizada = service.atualizarStatus(id, novoStatus);
        return ResponseEntity.ok(new SolicitacaoDTO(atualizada));
    }

}
