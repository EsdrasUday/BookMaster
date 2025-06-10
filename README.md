# 📚 BookMaster — Sistema de Gestão Bibliotecária

BookMaster é um sistema completo para gerenciamento de bibliotecas, desenvolvido em **Python (Flask)** com **MySQL**, **HTML5**, **CSS3** e **JavaScript**, com foco em usabilidade, organização e visual moderno.

## 🎯 Funcionalidades

- 📘 Cadastro de livros com imagem (capa salva pelo ISBN)
- 👤 Cadastro de usuários (CPF único)
- 🔄 Registro de empréstimos e devoluções
- 📊 Listagem:
  - Livros disponíveis
  - Livros emprestados (com nome, e-mail e data)
  - Usuários cadastrados
- 🔍 Catálogo com barra de busca interativa (filtro ao digitar)
- 🧭 Interface com sidebar dinâmica (SPA-like)
- 📁 Armazenamento de imagens em `static/img/`

---

## 🛠️ Tecnologias Utilizadas

| Stack         | Tecnologia        |
|---------------|-------------------|
| Backend       | Python + Flask    |
| Banco de Dados| MySQL             |
| Frontend      | HTML + CSS + JS   |
| Extras        | Flask-MySQLdb

---

## 🚀 Instalação

### 1. Clone o repositório
```bash
git clone https://github.com/seuusuario/bookmaster.git
cd bookmaster
