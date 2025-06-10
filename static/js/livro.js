const input = document.getElementById('imagem');
const fileName = document.getElementById('file-name');

input.addEventListener('change', function() {
    if (this.files.length > 0) {
        fileName.textContent = this.files[0].name;
    } else {
        fileName.textContent = 'Nenhum arquivo selecionado';
    }
});

let todosLivros = [];

function carregarLivros() {
  fetch('/api/livros_catalogo')
    .then(res => res.json())
    .then(data => {
      todosLivros = data;
      renderizarLivros(data);
    });
}

function renderizarLivros(livros) {
  const container = document.getElementById('lista-livros');
  container.innerHTML = livros.map(livro => `
    <div class="livro-card">
      <img src="${livro.imagem}" alt="${livro.titulo}">
      <h3>${livro.titulo}</h3>
      <p>${livro.autor}</p>
      <p><strong>ISBN:</strong> ${livro.isbn}</p>
    </div>
  `).join('');
}


document.addEventListener('DOMContentLoaded', () => {
  carregarLivros();

  const filtroInput = document.getElementById('filtro-livros');
  filtroInput.addEventListener('keyup', () => {
    const termo = filtroInput.value.toLowerCase();
    const filtrados = todosLivros.filter(l =>
      l.titulo.toLowerCase().includes(termo)
    );
    renderizarLivros(filtrados);
  });
});



function listarEmprestimos() {
  fetch('/api/emprestimos_ativos')
    .then(res => res.json())
    .then(data => {
      const tbody = document.querySelector('#tabela-emprestimos tbody');
      tbody.innerHTML = '';

      data.forEach(item => {
        const tr = document.createElement('tr');
        tr.innerHTML = `
          <td>${item.isbn}</td>
          <td>${item.titulo}</td>
          <td>${item.usuario}</td>
          <td>${item.email}</td>
          <td>${item.data}</td>
        `;
        tbody.appendChild(tr);
      });

      document.querySelectorAll('.secao').forEach(sec => sec.style.display = 'none');
      document.getElementById('emprestimos').style.display = 'block';
    });
}

