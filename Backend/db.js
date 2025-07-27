const mysql = require("mysql2");

const conexao = mysql.createConnection({
  host: "localhost",
  user: "", //seu usuario
  password: "", //sua senha
  database: "kanban_db"
});

conexao.connect(err => {
  if (err) {
    console.error("Erro ao conectar no MySQL:", err);
    return;
  }
  console.log("Conectado ao MySQL!");
});

module.exports = conexao;
