<?php
?>
<!DOCTYPE html>
<html lang="ca">

<head>
  <meta charset="UTF-8">
  <title>Administració del Quiz</title>
  <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
  <link rel="stylesheet" href="css/panel.css">
</head>

<body>
<div class="container my-4">
  <h1 class="text-center mb-4"> Administració del banc de preguntes</h1>

  <section id="formulari" class="card shadow p-4 mb-4">
    <h2 class="h4 mb-3">Crear nova pregunta</h2>
    <input type="text" class="form-control mb-3" id="novaPregunta" placeholder="Text de la pregunta">

    <div id="respostesInputs" class="mb-3">
      <input type="text" class="form-control mb-2" placeholder="Resposta 0">
      <input type="text" class="form-control mb-2" placeholder="Resposta 1">
      <input type="text" class="form-control mb-2" placeholder="Resposta 2">
      <input type="text" class="form-control mb-2" placeholder="Resposta 3">
    </div>

    <label class="form-label">Índex correcte (0–3):</label>
    <input type="number" class="form-control w-25 mb-3" id="correcte" min="0" max="3">

    <button class="btn btn-primary w-100" onclick="crearPregunta()"> Crear Pregunta</button>
  </section>

  <section id="llista">
    <h2 class="h4 mb-3"> Preguntes existents</h2>
    <div id="preguntesContainer" class="d-flex flex-column gap-3"></div>
  </section>
</div>

<div class="modal fade" id="editModal" tabindex="-1" aria-hidden="true">
  <div class="modal-dialog">
    <div class="modal-content">
      <div class="modal-header">
        <h5 class="modal-title">Editar pregunta</h5>
        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
      </div>
      <div class="modal-body">
        <input id="editQuestion" class="form-control mb-2" type="text">
        <div id="editAnswers" class="mb-2"></div>
        <label>Índex correcte (0-3):</label>
        <input id="editCorrect" class="form-control w-25" type="number" min="0" max="3">
      </div>
      <div class="modal-footer">
        <button class="btn btn-secondary" data-bs-dismiss="modal">Cancelar</button>
        <button class="btn btn-primary" onclick="guardarEdicion()">Guardar</button>
      </div>
    </div>
  </div>
</div>

<script>
let editId = null;

async function carregarPreguntes() {
  const res = await fetch('api/listaPreguntes.php');
  const preguntes = await res.json();
  const container = document.getElementById('preguntesContainer');
  container.innerHTML = '';

  preguntes.forEach(p => {
    const div = document.createElement('div');
    div.className = 'card shadow-sm';
    div.innerHTML = `
      <div class="card-body">
        <strong>${p.question_text}</strong>
        <hr>
        ${p.answers.map((a,i) => `<div>${i}: ${a}${i===p.correct_index?' ✅':''}</div>`).join('')}
        <div class="d-flex justify-content-end gap-2 mt-2">
          <button class="btn btn-sm btn-warning" onclick='abrirModal(${p.id}, "${p.question_text.replace(/"/g,"&quot;")}", ${JSON.stringify(p.answers)}, ${p.correct_index})'> Editar</button>
          <button class="btn btn-sm btn-danger" onclick="elimina(${p.id})"> Eliminar</button>
        </div>
      </div>
    `;
    container.appendChild(div);
  });
}

async function crearPregunta() {
  const question = document.getElementById('novaPregunta').value;
  const answers = Array.from(document.querySelectorAll('#respostesInputs input')).map(i=>i.value);
  const correct = parseInt(document.getElementById('correcte').value);

  await fetch('api/creaPregunta.php', {
    method: 'POST',
    headers: {'Content-Type':'application/json'},
    body: JSON.stringify({question, answers, correct})
  });

  document.getElementById('novaPregunta').value='';
  document.querySelectorAll('#respostesInputs input').forEach(i=>i.value='');
  document.getElementById('correcte').value='';
  carregarPreguntes();
}

async function elimina(id) {
  await fetch('api/eliminaPregunta.php', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({id})
  });
  carregarPreguntes();
}

function abrirModal(id, question, answers, correct) {
  editId = id;
  document.getElementById('editQuestion').value = question;
  document.getElementById('editAnswers').innerHTML =
    answers.map((a,i)=>`<input id="ea-${i}" class="form-control mb-1" type="text" value="${a}">`).join('');
  document.getElementById('editCorrect').value = correct;
  const modal = new bootstrap.Modal(document.getElementById('editModal'));
  modal.show();
}

async function guardarEdicion() {
  const question = document.getElementById('editQuestion').value;
  const answers = [];
  for(let i=0;i<4;i++){
    answers.push(document.getElementById(`ea-${i}`).value);
  }
  const correct = parseInt(document.getElementById('editCorrect').value);

  await fetch('api/editaPregunta.php', {
    method:'POST',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify({id: editId, question, answers, correct})
  });

  bootstrap.Modal.getInstance(document.getElementById('editModal')).hide();
  carregarPreguntes();
}

carregarPreguntes();
</script>

<script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.8/dist/js/bootstrap.bundle.min.js" crossorigin="anonymous"></script>
</body>
</html>
