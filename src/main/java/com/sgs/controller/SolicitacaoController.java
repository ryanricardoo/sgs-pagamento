package com.sgs.controller;

import com.sgs.model.Solicitacao;
import com.sgs.model.StatusSolicitacao;
import com.sgs.service.SolicitacaoService;
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
    public ResponseEntity<List<Solicitacao>> buscarPorDocumento(@RequestParam String documento){
        List<Solicitacao> lista = service.buscarPorDocumento(documento);
        return ResponseEntity.ok(lista);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Solicitacao> buscarPorId(@PathVariable Long id){
        Solicitacao obj = service.buscarPorId(id);
        return ResponseEntity.ok(obj);
    }

    @PostMapping
    public ResponseEntity<Solicitacao> criar(@RequestBody Solicitacao solicitacao){
        solicitacao.setId(null);
        Solicitacao novaSolicitacao = service.criar(solicitacao);
        return ResponseEntity.status(HttpStatus.CREATED).body(novaSolicitacao);
    }

    @PutMapping("/{id}/status")
    public ResponseEntity<Solicitacao> atualizarStatus(
            @PathVariable Long id,
            @RequestParam StatusSolicitacao novoStatus){

        Solicitacao atualizada = service.atualizarStatus(id, novoStatus);
        return ResponseEntity.ok(atualizada);
    }

}
