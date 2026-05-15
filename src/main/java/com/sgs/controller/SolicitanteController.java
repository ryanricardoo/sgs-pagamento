package com.sgs.controller;

import com.sgs.model.Solicitante;
import com.sgs.repository.SolicitanteRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/solicitantes")
@CrossOrigin(origins = "http://localhost:5173")
public class SolicitanteController {

    @Autowired
    private SolicitanteRepository repository;

    @GetMapping
    private List<Solicitante> listarTodos(){
        return repository.findAll();
    }
}
