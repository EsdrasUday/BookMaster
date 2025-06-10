function mostrarSecao(id) {
    document.querySelectorAll('.secao').forEach(sec => sec.style.display = 'none');
    document.getElementById(id).style.display = 'block';
}

function cadastrarLivro() {
    fetch('/api/livros', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            isbn: document.getElementById('isbn').value,
            titulo: document.getElementById('titulo').value,
            autor: document.getElementById('autor').value,
            ano: document.getElementById('ano').value
        })
    }).then(r => r.json()).then(data => alert(data.mensagem || data.erro));
}

function cadastrarUsuario() {
    fetch('/api/usuarios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            nome: document.getElementById('nome').value,
            cpf: document.getElementById('cpf').value,
            email: document.getElementById('email').value
        })
    }).then(r => r.json()).then(data => alert(data.mensagem || data.erro));
}

function realizarEmprestimo() {
    fetch('/api/emprestimos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            livro_id: document.getElementById('livroIdEmp').value,
            usuario_id: document.getElementById('usuarioIdEmp').value
        })
    }).then(r => r.json()).then(data => alert(data.mensagem || data.erro));
}

function registrarDevolucao() {
    fetch('/api/devolucao', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            livro_id: document.getElementById('livroIdDev').value
        })
    }).then(r => r.json()).then(data => alert(data.mensagem || data.erro));
}

function listarLivros() {
    fetch('/api/livros_catalogo')
    .then(r => r.json())
    .then(data => {
        document.getElementById('resultado').innerHTML =
            '<h2>Catálogo de Livros</h2>' +
            '<div class="livros-grid">' +
            data.map(l => `
                <div class="livro-card">
                    <img src="${l.imagem}" alt="${l.titulo}" />
                    <h3>${l.titulo}</h3>
                    <p>${l.autor}</p>
                </div>
            `).join('') +
            '</div>';
    });
}



function listarUsuarios() {
    fetch('/api/usuarios')
    .then(res => res.json())
    .then(usuarios => {
        const tbody = document.querySelector('#tabela-usuarios tbody');
        tbody.innerHTML = ''; // Limpa antes

        usuarios.forEach(u => {
            const tr = document.createElement('tr');
            tr.innerHTML = `
                <td>${u.id}</td>
                <td>${u.nome}</td>
                <td>${u.cpf}</td>
                <td>${u.email}</td>
            `;
            tbody.appendChild(tr);
        });

        // Mostrar a seção
        document.querySelectorAll('.secao').forEach(sec => sec.style.display = 'none');
        document.getElementById('usuarios').style.display = 'block';
    });
}




// Enviar empréstimo
document.getElementById('form-emprestimo').addEventListener('submit', function (e) {
  e.preventDefault();

  const livroId = document.getElementById('livroIdEmp').value;
  const usuarioId = document.getElementById('usuarioIdEmp').value;

  fetch('/api/emprestimos', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ livro_id: livroId, usuario_id: usuarioId })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('msg-emprestimo').textContent = data.mensagem || data.erro;
    })
    .catch(() => {
      document.getElementById('msg-emprestimo').textContent = 'Erro ao processar empréstimo.';
    });
});

// Enviar devolução
document.getElementById('form-devolucao').addEventListener('submit', function (e) {
  e.preventDefault();

  const livroId = document.getElementById('livroIdDev').value;

  fetch('/api/devolucao', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ livro_id: livroId })
  })
    .then(res => res.json())
    .then(data => {
      document.getElementById('msg-devolucao').textContent = data.mensagem || data.erro;
    })
    .catch(() => {
      document.getElementById('msg-devolucao').textContent = 'Erro ao processar devolução.';
    });
});
