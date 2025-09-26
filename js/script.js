let estatDeLaPartida = {
  contadorPreguntes: 0,
  respostesUsuari: [],
  totalPreguntes: 0,
};

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
    let correcta = preguntesGuardades[i].correcta;

    if (respostaUsuari === undefined) {
      html += `<li class="list-group-item"> Pregunta ${i + 1}:
     <span class="text-muted">Sense respondre</span>`;
    } else {
      let respostaText = preguntesGuardades[i].respostes[respostaUsuari - 1];
      let esCorrecta = respostaText === correcta;

      html += `<li class="list-group-item d-flex justify-content-between align-items-center">
        ${i + 1} <span class ="badge ${esCorrecta ? "bg-success" : "bg-danger"} "> 
         ${esCorrecta ? "✓" : "✘"}
         </span>
         </li>`;
    }
  }
  html += `</ul>`;
  panel.innerHTML = html;
}

function marcarRespuesta(numPregunta, numRespuesta) {
  console.log("Pregunta " + numPregunta + " Resposta " + numRespuesta);


if(estatDeLaPartida.respostesUsuari[numPregunta - 1] !== undefined){
  
  return;
}
  estatDeLaPartida.respostesUsuari[numPregunta - 1] = numRespuesta;

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
      estatDeLaPartida.respostesUsuari[numPreguntaActual] === j + 1
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

function renderJuego(data) {
  estatDeLaPartida.totalPreguntes = data.preguntes.length;

  
  for (let i = 0; i < data.preguntes.length; i++) {
    let respostes = [
      //utilitzem el spread operator per juntar un string amb un array d'strings  
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
        actualizarPanel();

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
