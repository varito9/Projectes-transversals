// Estat de la partida guarda el índice/número de la resposta seleccionada per l'usuari
let estatDeLaPartida = {
  contadorPreguntes: 0,
  respostesUsuari: [],
  totalPreguntes: 0,
};

// Guarda el valor String de les preguntes i respostes
let preguntesGuardades = [];
let numPreguntaActual = 0;

function actualitzarMarcador() {
  let marcador = document.getElementById("marcador");
  marcador.innerHTML = `<p>Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de ${estatDeLaPartida.totalPreguntes}</p>`;
}

function actualizarPanel() {
  let panel = document.getElementById("panelRespostes");
  let html = `<ul class="list-group">`;

  for (let i = 0; i < preguntesGuardades.length; i++) {
    let respostaUsuari = estatDeLaPartida.respostesUsuari[i];

    if (respostaUsuari === undefined) {
      html += `<li class="list-group-item"> Pregunta ${i + 1}:
        <span class="text-muted">Resposta pendent</span></li>`;
    } else {
      html += `<li class="list-group-item"> Pregunta ${i + 1}:
        <span class="text-primary">Ja resposta</span></li>`;
    }
  }
  html += `</ul>`;
  panel.innerHTML = html;
}


function marcarRespuesta(numPregunta, numRespuesta) {
  if (estatDeLaPartida.respostesUsuari[numPregunta - 1] !== undefined) {
    return;
  }
  estatDeLaPartida.respostesUsuari[numPregunta - 1] = {
    idPregunta: preguntesGuardades[numPregunta - 1].id,
    respostaText: preguntesGuardades[numPregunta - 1].respostes[numRespuesta - 1],
    index: numRespuesta - 1,

  };

  estatDeLaPartida.contadorPreguntes++;

  //https://github.com/alvaroph/tr0_daw

  actualitzarMarcador();
  actualizarPanel();
  renderPreguntaActual();

if (estatDeLaPartida.contadorPreguntes === estatDeLaPartida.totalPreguntes) {
  document.getElementById("btnResultats").classList.remove("hidden");
}
  
}

function renderPreguntaActual() {
  let contenidor = document.getElementById("partida");
  let pregunta = preguntesGuardades[numPreguntaActual];
  let htmlString = "";

  htmlString = `<h3 class="margen">${numPreguntaActual + 1}. ${
    pregunta.pregunta
  }</h3>`;
  htmlString += `<div class="margen-bandera"><img class="bandera" src="${pregunta.imatge}" alt="imatge pregunta"></div><br>`;

  htmlString += `<div class="margen-boton">`;
  for (let j = 0; j < pregunta.respostes.length; j++) {
    let seleccionada =
      estatDeLaPartida.respostesUsuari[numPreguntaActual]?.index === j
        ? "seleccionada"
        : "";

    let disabled =
      estatDeLaPartida.respostesUsuari[numPreguntaActual] !== undefined
        ? "disabled"
        : "";

    htmlString += `<button class="resposta ${seleccionada}" ${disabled} data-pregunta="${
      numPreguntaActual + 1
    }" data-resposta="${j + 1}">${pregunta.respostes[j]}</button>`;
  }
  htmlString += `</div>`;

  htmlString += `<div class="margen-boton navegacion">`;
  if (numPreguntaActual > 0) {
    htmlString += `<button id="atras" class="btn btn-outline-dark"><i class="bi bi-arrow-left icono"></i></button>`;
  }
  if (numPreguntaActual < estatDeLaPartida.totalPreguntes - 1) {
    htmlString += `<button id="adelante" class="btn btn-outline-dark">  <i class="bi bi-arrow-right icono"></i></button>`;
  }
  htmlString += `</div>`;

  contenidor.innerHTML = htmlString;

  if (document.getElementById("atras")) {
    document.getElementById("atras").addEventListener("click", () => {
      numPreguntaActual--;
      renderPreguntaActual();
    });
  }
  if (document.getElementById("adelante")) {
    document.getElementById("adelante").addEventListener("click", () => {
      numPreguntaActual++;
      renderPreguntaActual();
    });
  }
}

function enviarResultats() {
document.getElementById("btnResultats").classList.add("hidden");
document.getElementById("marcador").classList.add("hidden");

  fetch("/api/finalitza.php", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(estatDeLaPartida.respostesUsuari),
  })
    .then((response) => {
      if (!response.ok) throw new Error("Error al enviar resultats");
      return response.json();
    })
    .then((resultats) => {
      mostrarResultats(resultats);
    })
    .catch((err) => console.error(err));
}

function mostrarResultats(resultats) {
  let contenidor = document.getElementById("partida");
  contenidor.innerHTML = `
    <h2 class="resultat">Resultats</h2>
    <p class="margen">Has encertat ${resultats.correctes} de ${resultats.total} preguntes.</p>
    <div class="margen-boton"> <button id="reiniciar" class="">Tornar a jugar</button></div>
  `;

  
    document.getElementById("reiniciar").addEventListener("click", () => {
      inicialitzarPartida();
    });
}


  // Repetim codi per reiniciar la partida perquè sinó dona tornaria a recarregar la pàgina sencera
  // amb location.reload()

function inicialitzarPartida(numPreguntes = 10) {
  estatDeLaPartida = {
      contadorPreguntes: 0,
      respostesUsuari: [],
      totalPreguntes: 0,
    };
    preguntesGuardades = [];
    numPreguntaActual = 0;

    document.getElementById("panelRespostes").innerHTML = "";
    document.getElementById("marcador").innerHTML = "";
    document.getElementById("btnResultats").classList.add("hidden");


      fetch(`/api/getPreguntes.php?num=${numPreguntes}`)
        .then((response) =>{
      if (!response.ok) throw new Error("Error al carregar preguntes");
      return response.json();
    })
        .then((data) => {
          estatDeLaPartida.totalPreguntes = data.preguntes.length;
          preguntesGuardades = data.preguntes;
          renderPreguntaActual();
          actualitzarMarcador();
          actualizarPanel();
        })
        .catch((err) => console.error(err));
}

window.addEventListener("DOMContentLoaded", () => {
  inicialitzarPartida();
  document.getElementById("partida").addEventListener("click", (event) => {
    if (event.target.classList.contains("resposta")) {
      let numPregunta = parseInt(event.target.dataset.pregunta);
      let numRespuesta = parseInt(event.target.dataset.resposta);
      marcarRespuesta(numPregunta, numRespuesta);
    }
  });

  document.getElementById("btnResultats").addEventListener("click", () => {
    enviarResultats();
  });
});
