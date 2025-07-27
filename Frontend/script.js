const API_URL = "http://localhost:3000/tarefas";

let tarefas = [];

document.addEventListener("DOMContentLoaded", () => {
  carregarTarefas();

  document.getElementById("form-tarefa").addEventListener("submit", e => {
    e.preventDefault();
    adicionarTarefa();
  });

  document.querySelectorAll(".tarefas").forEach(coluna => {
    coluna.addEventListener("dragover", event => event.preventDefault());

    coluna.addEventListener("dragenter", () => coluna.classList.add("dragover"));
    coluna.addEventListener("dragleave", () => coluna.classList.remove("dragover"));

    coluna.addEventListener("drop", event => {
      event.preventDefault();
      coluna.classList.remove("dragover");

      const idTarefa = parseInt(event.dataTransfer.getData("text/plain"));
      const statusNovo = coluna.id;

      const tarefa = tarefas.find(t => t.id === idTarefa);
      if (tarefa && tarefa.status !== statusNovo) {
        fetch(`${API_URL}/${idTarefa}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            titulo: tarefa.titulo,
            descricao: tarefa.descricao,
            status: statusNovo
          })
        })
          .then(res => {
            if (!res.ok) throw new Error("Erro na atualização do status");
            return res.json();
          })
          .then(tarefaAtualizada => {
            tarefa.status = statusNovo;
            renderizarTarefas();
          })
          .catch(err => {
            console.error("Erro ao mover tarefa:", err);
            alert("Erro ao salvar mudança. Tente novamente.");
          });
      }
    });
  });
});

function carregarTarefas() {
  fetch(API_URL)
    .then(res => res.json())
    .then(data => {
      tarefas = data;
      renderizarTarefas();
    })
    .catch(err => console.error("Erro ao carregar tarefas:", err));
}

function adicionarTarefa() {
  const titulo = document.getElementById("titulo").value.trim();
  const descricao = document.getElementById("descricao").value.trim();

  if (!titulo) {
    alert("Digite um título!");
    return;
  }

  const novaTarefa = { titulo, descricao, status: "afazer" };

  fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(novaTarefa)
  })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao criar tarefa");
      return res.json();
    })
    .then(tarefaCriada => {
      tarefas.push(tarefaCriada);
      renderizarTarefas();
      limparCampos();
    })
    .catch(err => {
      console.error("Erro ao adicionar tarefa:", err);
      alert("Erro ao adicionar tarefa.");
    });
}

function renderizarTarefas() {
  ["afazer", "progresso", "concluido"].forEach(status => {
    document.getElementById(status).innerHTML = "";
  });

  tarefas.forEach(tarefa => {
    const container = document.getElementById(tarefa.status);
    const card = document.createElement("div");
    card.className = "card";
    card.draggable = true;
    card.dataset.id = tarefa.id;

    card.innerHTML = `
      <strong>${tarefa.titulo}</strong>
      <p>${tarefa.descricao}</p>
      <div class="botoes">
        <button onclick="editarTarefa(${tarefa.id})">Editar</button>
        <button onclick="excluirTarefa(${tarefa.id})">Excluir</button>
      </div>
    `;

    card.addEventListener("dragstart", dragStart);
    card.addEventListener("dragend", dragEnd);

    container.appendChild(card);
  });
}

function limparCampos() {
  document.getElementById("titulo").value = "";
  document.getElementById("descricao").value = "";
}

function editarTarefa(id) {
  const tarefa = tarefas.find(t => t.id === id);
  if (!tarefa) return;

  const novoTitulo = prompt("Novo título:", tarefa.titulo);
  const novaDescricao = prompt("Nova descrição:", tarefa.descricao);

  if (novoTitulo !== null && novaDescricao !== null) {
    fetch(`${API_URL}/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        titulo: novoTitulo,
        descricao: novaDescricao,
        status: tarefa.status
      })
    })
      .then(res => {
        if (!res.ok) throw new Error("Erro ao editar tarefa");
        return res.json();
      })
      .then(tarefaAtualizada => {
        const index = tarefas.findIndex(t => t.id === id);
        tarefas[index] = tarefaAtualizada;
        renderizarTarefas();
      })
      .catch(err => {
        console.error("Erro ao editar tarefa:", err);
        alert("Erro ao editar tarefa.");
      });
  }
}

function excluirTarefa(id) {
  fetch(`${API_URL}/${id}`, { method: "DELETE" })
    .then(res => {
      if (!res.ok) throw new Error("Erro ao excluir tarefa");
      tarefas = tarefas.filter(t => t.id !== id);
      renderizarTarefas();
    })
    .catch(err => {
      console.error("Erro ao excluir tarefa:", err);
      alert("Erro ao excluir tarefa.");
    });
}

function dragStart(event) {
  event.dataTransfer.setData("text/plain", event.target.dataset.id);
  event.target.classList.add("dragging");
}

function dragEnd(event) {
  event.target.classList.remove("dragging");
}
