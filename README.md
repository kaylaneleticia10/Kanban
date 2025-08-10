## Kanban com Drag and Drop ##
Este é um sistema Kanban Web simples e funcional, com tarefas organizadas em colunas (A Fazer, Em Progresso e Concluído), onde você pode criar, editar, excluir e mover tarefas entre colunas com suporte a drag and drop.

O projeto foi feito com:

Front-end: HTML, CSS e JavaScript puro

Back-end: Node.js + Express

Banco de Dados: MySQL local
Funcionalidades
Adicionar nova tarefa
Editar título e descrição
Excluir tarefa
Arrastar tarefa entre colunas (drag and drop)
Atualização automática no banco de dados

## 1. Instale as dependências ##
npm install

## 2. Configure o banco de dados ##
No MySQL, crie o banco e a tabela com os seguintes comandos:

CREATE DATABASE kanban_db;

USE kanban_db;

CREATE TABLE tarefas ( id INT AUTO_INCREMENT PRIMARY KEY, titulo VARCHAR(255), descricao TEXT, status ENUM(‘afazer’, ‘progresso’, ‘concluido’) DEFAULT ‘afazer’ );

## 3. Ajuste as credenciais do banco ##
No arquivo backend/db.js, configure com seus dados locais:

const conexao = mysql.createConnection({ host: “localhost”, user: “SEU_USUARIO”, password: “SUA_SENHA”, database: “kanban_db” });

## 4. Inicie o servidor no backend ##
node server.js

## Observações ##
O banco de dados é local, então o projeto precisa ser testado na sua máquina com o MySQL configurado.
