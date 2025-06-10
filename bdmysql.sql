CREATE DATABASE IF NOT EXISTS biblioteca;
USE biblioteca;


CREATE TABLE livros (
    isbn VARCHAR(20) PRIMARY KEY,
    titulo VARCHAR(255) NOT NULL,
    autor VARCHAR(255) NOT NULL,
    ano INT CHECK (ano > 0),
    status ENUM('disponivel', 'emprestado') DEFAULT 'disponivel'
);


CREATE TABLE usuarios (
    id INT AUTO_INCREMENT PRIMARY KEY,
    nome VARCHAR(255) NOT NULL,
    cpf VARCHAR(14) NOT NULL UNIQUE,
    email VARCHAR(255) NOT NULL
);


CREATE TABLE emprestimos (
    id INT AUTO_INCREMENT PRIMARY KEY,
    livro_id VARCHAR(20),
    usuario_id INT,
    data_emprestimo DATE NOT NULL,
    data_devolucao DATE,

    FOREIGN KEY (livro_id) REFERENCES livros(isbn) ON DELETE RESTRICT ON UPDATE CASCADE,
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id) ON DELETE RESTRICT ON UPDATE CASCADE,

    CONSTRAINT chk_datas CHECK (data_devolucao IS NULL OR data_devolucao >= data_emprestimo)
);
