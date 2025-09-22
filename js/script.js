let estatDeLaPartida = {
  contadorPreguntes: 0,
  respostesUsuari: [],
  totalPreguntes: 0,
};

let preguntesGuardades = [];
let numPreguntaActual = 0;

function actualitzarMarcador() {
  let marcador = document.getElementById("marcador");
  marcador.innerHTML = `Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de ${estatDeLaPartida.totalPreguntes}`;
}

function marcarRespuesta(numPregunta, numRespuesta) {
  console.log("Pregunta " + numPregunta + " Resposta " + numRespuesta);

  if (estatDeLaPartida.respostesUsuari[numPregunta - 1] === undefined) {
    estatDeLaPartida.contadorPreguntes++;
  }

  estatDeLaPartida.respostesUsuari[numPregunta - 1] = numRespuesta;

  let pregunta = preguntesGuardades[numPregunta - 1];
  let respuestaSeleccionada = pregunta.respostes[numRespuesta - 1];

  if (respuestaSeleccionada === pregunta.correcta) {
    console.log("Resposta correcta");
  } else {
    console.log("Resposta incorrecta");
  }

  //https://github.com/alvaroph/tr0_daw

  actualitzarMarcador();

  renderPreguntaActual();

  if (estatDeLaPartida.contadorPreguntes === estatDeLaPartida.totalPreguntes) {
    document.getElementById("btnResultats").classList.remove("hidden");
  }
}

function renderPreguntaActual() {
  let contenidor = document.getElementById("partida");
  let pregunta = preguntesGuardades[numPreguntaActual];
  let htmlString = "";

  htmlString = `<h3>${numPreguntaActual + 1}. ${pregunta.pregunta}</h3>`;
  htmlString += `<img class="bandera" src="${pregunta.imatge}" alt="imatge pregunta"><br>`;

  for (let j = 0; j < pregunta.respostes.length; j++) {
    let seleccionada =
      estatDeLaPartida.respostesUsuari[numPreguntaActual] === j + 1
        ? "seleccionada"
        : "";

    htmlString += `<button class="resposta ${seleccionada}" data-pregunta="${
      numPreguntaActual + 1
    }" data-resposta="${j + 1}">${pregunta.respostes[j]}</button>`;
  }

  htmlString += `<div class="navegacion">`;
  if (numPreguntaActual > 0) {
    htmlString += `<button id="atras">⬅️ Enrere</button>`;
  }
  if (numPreguntaActual < estatDeLaPartida.totalPreguntes - 1) {
    htmlString += `<button id="adelante">➡️ Davant</button>`;
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

function renderJuego(data) {
  estatDeLaPartida.totalPreguntes = data.preguntes.length;

  for (let i = 0; i < data.preguntes.length; i++) {
    let respostes = [
      data.preguntes[i].resposta_correcta,
      ...data.preguntes[i].respostes_incorrectes,
    ];
    respostes.sort(() => Math.random() - 0.5);

    preguntesGuardades[i] = {
      respostes: respostes,
      imatge: data.preguntes[i].imatge,
      correcta: data.preguntes[i].resposta_correcta,
      pregunta: data.preguntes[i].pregunta,
    };
  }
  renderPreguntaActual();
}

window.addEventListener("DOMContentLoaded", () => {
  fetch("./js/data.json")
    .then((response) => {
      if (!response.ok) throw new Error("Error al cargar data.json");
      return response.json();
    })
    .then((data) => {
      renderJuego(data);
      actualitzarMarcador();
    })
    .catch((err) => console.error(err));

  document.getElementById("partida").addEventListener("click", (event) => {
    if (event.target.classList.contains("resposta")) {
      let numPregunta = parseInt(event.target.dataset.pregunta);
      let numRespuesta = parseInt(event.target.dataset.resposta);
      marcarRespuesta(numPregunta, numRespuesta);
    }
  });
});
