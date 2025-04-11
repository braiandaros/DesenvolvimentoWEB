const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const port = 3000;

// Configurar banco de dados SQLite
const db = new sqlite3.Database("banco.sqlite", (err) => {
  if (err) {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  } else {
    console.log("Conectado ao SQLite.");
  }
});

// Criar tabela se não existir
db.run(`
  CREATE TABLE IF NOT EXISTS usuarios (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    nome TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE,
    senha TEXT NOT NULL
  )
`);

app.use(cors());
app.use(bodyParser.json());

// Rota para salvar dados no banco
app.post("/salvar", (req, res) => {
  const { nome, email, senha1 } = req.body;

  if (!nome || !email || !senha1) {
    return res.status(400).json({ erro: "Todos os campos são obrigatórios!" });
  }

  db.run(
    "INSERT INTO usuarios (nome, email, senha) VALUES (?, ?, ?)",
    [nome, email, senha1],
    (err) => {
      if (err) {
        return res.status(500).json({ erro: "Erro ao salvar no banco." });
      }
      res.json({ mensagem: "Usuário cadastrado com sucesso!" });
    }
  );
});

// Iniciar servidor
app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});
