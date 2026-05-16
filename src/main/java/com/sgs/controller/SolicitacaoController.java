package com.sgs.controller;

import com.sgs.dto.SolicitacaoDTO;
import com.sgs.dto.SolicitacaoRequestDTO;
import com.sgs.dto.StatusRequestDTO;
import com.sgs.model.Solicitacao;
import com.sgs.service.SolicitacaoService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.List;

@RestController
@RequestMapping("/api/solicitacoes")
@CrossOrigin(origins = "http://localhost:5173")
public class SolicitacaoController {

    @Autowired
    private SolicitacaoService service;

    @GetMapping
    public ResponseEntity<List<SolicitacaoDTO>> listarTodos(
            @RequestParam(required = false) String status,
            @RequestParam(required = false) Long categoriaId,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime inicio,
            @RequestParam(required = false) @DateTimeFormat(iso = DateTimeFormat.ISO.DATE_TIME) LocalDateTime fim){
        List<SolicitacaoDTO> dtos = service.listarTodos(status, categoriaId, inicio, fim);
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
            @RequestBody StatusRequestDTO request){

        Solicitacao atualizada = service.atualizarStatus(id, request.novoStatus());
        return ResponseEntity.ok(new SolicitacaoDTO(atualizada));
    }

}
