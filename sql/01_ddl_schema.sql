-- DDL: CRIAÇÃO (EXECUTAR PRIMEIRO)

CREATE DATABASE IF NOT EXISTS db_sgs_pagamento;
USE db_sgs_pagamento;



CREATE TABLE IF NOT EXISTS tb_solicitante (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(100) NOT NULL,
    cpf_cnpj VARCHAR(20) NOT NULL UNIQUE
);


CREATE TABLE IF NOT EXISTS tb_categoria (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(50) NOT NULL
);


CREATE TABLE IF NOT EXISTS tb_solicitacao (
    id BIGINT AUTO_INCREMENT PRIMARY KEY,
    solicitante_id BIGINT NOT NULL,
    categoria_id BIGINT NOT NULL,
    descricao TEXT NOT NULL,
    valor DECIMAL(10, 2) NOT NULL,
    data_solicitacao DATETIME NOT NULL,
    status VARCHAR(20) NOT NULL,
    CONSTRAINT fk_solicitacao_solicitante FOREIGN KEY (solicitante_id) REFERENCES tb_solicitante(id),
    CONSTRAINT fk_solicitacao_categoria FOREIGN KEY (categoria_id) REFERENCES tb_categoria(id)
);