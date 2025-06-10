from flask import Flask, render_template, request, jsonify, redirect
from flask_mysqldb import MySQL
import os

app = Flask(__name__)
app.config['UPLOAD_FOLDER'] = 'static/img'
app.config['MYSQL_HOST'] = 'localhost'
app.config['MYSQL_USER'] = 'root'
app.config['MYSQL_PASSWORD'] = ''
app.config['MYSQL_DB'] = 'biblioteca'

mysql = MySQL(app)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/cadastrar_livro', methods=['POST'])
def cadastrar_livro():
    isbn = request.form['isbn']
    titulo = request.form['titulo']
    autor = request.form['autor']
    ano = request.form['ano']
    imagem = request.files['imagem']

    if imagem:
        ext = os.path.splitext(imagem.filename)[1]
        imagem_path = os.path.join(app.config['UPLOAD_FOLDER'], f"{isbn}{ext}")
        imagem.save(imagem_path)

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO livros (isbn, titulo, autor, ano, status) VALUES (%s, %s, %s, %s, 'disponível')",
                (isbn, titulo, autor, ano))
    mysql.connection.commit()
    cur.close()
    return redirect('/')

@app.route('/api/livros_catalogo', methods=['GET'])
def livros_catalogo():
    cur = mysql.connection.cursor()
    cur.execute("SELECT isbn, titulo, autor FROM livros")
    livros = cur.fetchall()
    cur.close()

    lista = []
    for row in livros:
        isbn, titulo, autor = row
        lista.append({
            'isbn': isbn,
            'titulo': titulo,
            'autor': autor,
            'imagem': f"/static/img/{isbn}.png"
        })
    return jsonify(lista)

@app.route('/cadastrar_usuario', methods=['POST'])
def cadastrar_usuario():
    nome = request.form['nome']
    cpf = request.form['cpf']
    email = request.form['email']

    cur = mysql.connection.cursor()
    cur.execute("INSERT INTO usuarios (nome, cpf, email) VALUES (%s, %s, %s)", (nome, cpf, email))
    mysql.connection.commit()
    cur.close()
    return redirect('/')

@app.route('/api/usuarios')
def listar_usuarios():
    cur = mysql.connection.cursor()
    cur.execute("SELECT id, nome, cpf, email FROM usuarios")
    resultado = cur.fetchall()
    cur.close()

    usuarios = [
        {'id': row[0], 'nome': row[1], 'cpf': row[2], 'email': row[3]}
        for row in resultado
    ]
    return jsonify(usuarios)


@app.route('/api/emprestimos_ativos')
def emprestimos_ativos():
    cur = mysql.connection.cursor()
    cur.execute("""
        SELECT livros.isbn, livros.titulo, usuarios.nome, usuarios.email, emprestimos.data_emprestimo
        FROM emprestimos
        JOIN livros ON emprestimos.livro_id = livros.isbn
        JOIN usuarios ON emprestimos.usuario_id = usuarios.id
        WHERE emprestimos.data_devolucao IS NULL
    """)
    resultado = cur.fetchall()
    cur.close()

    emprestimos = [
        {
            'isbn': row[0],
            'titulo': row[1],
            'usuario': row[2],
            'email': row[3],
            'data': row[4].strftime('%d/%m/%Y')
        }
        for row in resultado
    ]
    return jsonify(emprestimos)

@app.route('/api/emprestimos', methods=['POST'])
def emprestar_livro():
    data = request.get_json()
    livro_id = data['livro_id']
    usuario_id = data['usuario_id']

    cur = mysql.connection.cursor()

    # Verificações
    cur.execute("SELECT * FROM livros WHERE isbn=%s AND status='disponível'", (livro_id,))
    livro = cur.fetchone()

    cur.execute("SELECT * FROM usuarios WHERE id=%s", (usuario_id,))
    usuario = cur.fetchone()

    if not livro:
        return jsonify({'erro': 'Livro não disponível ou inexistente'}), 404
    if not usuario:
        return jsonify({'erro': 'Usuário não encontrado'}), 404

    # Inserir empréstimo
    cur.execute("INSERT INTO emprestimos (livro_id, usuario_id, data_emprestimo) VALUES (%s, %s, CURDATE())",
                (livro_id, usuario_id))
    cur.execute("UPDATE livros SET status='emprestado' WHERE isbn=%s", (livro_id,))
    mysql.connection.commit()
    cur.close()

    return jsonify({'mensagem': 'Empréstimo registrado com sucesso!'})

@app.route('/api/devolucao', methods=['POST'])
def devolver_livro():
    data = request.get_json()
    livro_id = data['livro_id']

    cur = mysql.connection.cursor()
    cur.execute("UPDATE emprestimos SET data_devolucao=CURDATE() WHERE livro_id=%s AND data_devolucao IS NULL", (livro_id,))
    cur.execute("UPDATE livros SET status='disponível' WHERE isbn=%s", (livro_id,))
    mysql.connection.commit()
    cur.close()

    return jsonify({'mensagem': 'Livro devolvido com sucesso!'})



if __name__ == '__main__':
    if not os.path.exists('static/img'):
        os.makedirs('static/img')
    app.run(debug=True)