function buscarLivro() {
    const termo = document.getElementById("buscador").value;
    if(termo.trim() !== "") {
        alert(`Buscando pelo livro: ${termo}`);
    } else {
        alert("Digite um nome para buscar.");
    }
}
