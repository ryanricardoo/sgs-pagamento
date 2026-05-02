-- DML: INSERÇÃO DE DADOS (EXECUTAR DEPOIS DO 01_dml_schama.sql)


INSERT INTO tb_categoria (nome) VALUES
('Serviços'),
('Material'),
('Transporte'),
('Manutenção'),
('Diárias');


INSERT INTO tb_solicitante (nome, cpf_cnpj) VALUES
('João Ricardo Silva', '123.456.789-01'),
('Maria Fernanda Oliveira', '987.654.321-00'),
('Carlos Eduardo Souza', '456.789.123-44'),
('Sergipe Tecnologia LTDA', '12.345.678/0001-99'),
('Distribuidora de Materiais S.A.', '98.765.432/0001-88');