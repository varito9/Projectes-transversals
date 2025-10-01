// Estat de la partida guarda el índice/número de la resposta seleccionada per l'usuari
let estatDeLaPartida = {
  contadorPreguntes: 0,
  respostesUsuari: [],
  totalPreguntes: 0,
};

// Guarda el valor String de les preguntes i respostes
let preguntesGuardades = [];
let numPreguntaActual = 0;

function Usuari() {
  const formulari = document.getElementById("formulariUsuari");
  const benvinguda = document.getElementById("benvingudaUsuari");
  const nomJugador = document.getElementById("nomJugador");

  const nomGuardat = localStorage.getItem("nomUsuari");

  if (nomGuardat) {
    formulari.classList.add("hidden");
    benvinguda.classList.remove("hidden");
    nomJugador.textContent = nomGuardat;
    inicialitzarPartida();
  } else {
    formulari.classList.remove("hidden");
    benvinguda.classList.add("hidden");
  }
}

function actualitzarMarcador() {
  let marcador = document.getElementById("marcador");
  marcador.innerHTML = `<p class="izquierda">Preguntes respostes: ${estatDeLaPartida.contadorPreguntes} de ${estatDeLaPartida.totalPreguntes}</p>`;
}

function actualizarPanel() {
  let panel = document.getElementById("panelRespostes");
  let html = `<ul>`;

  for (let i = 0; i < preguntesGuardades.length; i++) {
    let respostaUsuari = estatDeLaPartida.respostesUsuari[i];

    let estat = "";
    if (respostaUsuari === undefined) {
      estat = `<span class="text-black">Resposta pendent</span>`;
    } else {
      estat = `<span class="text-black">Ja resposta</span>`;
    }

    html += `<button class=" irPregunta w-100 text-start" data-pregunta="${i}">
          Pregunta ${i + 1}: ${estat}
        </button>`;
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
    respostaText:
      preguntesGuardades[numPregunta - 1].respostes[numRespuesta - 1],
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

  // En producción cambiamos a /src/api/finalitza.php
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

  let panel = document.getElementById("panelRespostes");
  let html = `<ul class="list-group">`;

  for (let i = 0; i < resultats.detall.length; i++) {
    let preguntaDetall = resultats.detall[i];

    if (preguntaDetall.correcte) {
      html += `<button class="correcto"> Pregunta ${
        i + 1
      }: ✅ Correcte</button>`;
    } else {
      html += `<button class="incorrecto"> Pregunta ${
        i + 1
      }: ❌ Incorrecte</button>`;
    }
  }
  html += `</ul>`;
  panel.innerHTML = html;

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

  // En producción cambiamos a /src/api/getPreguntes.php
  fetch(`/api/getPreguntes.php?num=${numPreguntes}`)
    .then((response) => {
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
  Usuari();
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

  //Usuari
  document.getElementById("btnComençar").addEventListener("click", () => {
    const nom = document.getElementById("nomUsuari").value;
    if (nom) {
      localStorage.setItem("nomUsuari", nom);
      Usuari();
    } else {
      alert("Si us plau, introdueix un nom.");
    }
  });

  document.getElementById("btnEsborrar").addEventListener("click", () => {
    localStorage.removeItem("nomUsuari");
    document.getElementById("nomUsuari").value = "";
    document.getElementById("partida").innerHTML = "";
    document.getElementById("panelRespostes").innerHTML =
      "<p class='text-muted'>Encara no hi ha respostes</p>";
    Usuari();
  });

  document.getElementById("panelRespostes").addEventListener("click", (event) => {
  if (event.target.classList.contains("irPregunta")) {
    let num = parseInt(event.target.dataset.pregunta); // índice en array
    numPreguntaActual = num;
    renderPreguntaActual();
  }
});
});
