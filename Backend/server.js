const express = require("express");
const cors = require("cors");
const bodyParser = require("body-parser");
const db = require("./db");

const app = express();
const PORT = 3000;

app.use(cors());
app.use(bodyParser.json());

// Listar tarefas
app.get("/tarefas", (req, res) => {
  db.query("SELECT * FROM tarefas", (err, results) => {
    if (err) return res.status(500).json({ erro: "Erro ao buscar tarefas" });
    res.json(results);
  });
});

// Criar tarefa
app.post("/tarefas", (req, res) => {
  const { titulo, descricao, status } = req.body;
  const sql = "INSERT INTO tarefas (titulo, descricao, status) VALUES (?, ?, ?)";
  db.query(sql, [titulo, descricao, status || "afazer"], (err, result) => {
    if (err) return res.status(500).json({ erro: "Erro ao criar tarefa" });
    res.json({ id: result.insertId, titulo, descricao, status: status || "afazer" });
  });
});

// Atualizar tarefa
app.put("/tarefas/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, descricao, status } = req.body;

  const sql = "UPDATE tarefas SET titulo = ?, descricao = ?, status = ? WHERE id = ?";
  db.query(sql, [titulo, descricao, status, id], (err) => {
    if (err) return res.status(500).json({ erro: "Erro ao atualizar tarefa" });
    res.json({ id, titulo, descricao, status });
  });
});

// Excluir tarefa
app.delete("/tarefas/:id", (req, res) => {
  const { id } = req.params;
  db.query("DELETE FROM tarefas WHERE id = ?", [id], (err) => {
    if (err) return res.status(500).json({ erro: "Erro ao excluir tarefa" });
    res.json({ mensagem: "Tarefa excluída com sucesso" });
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando em http://localhost:${PORT}`);
});
