let estatDeLaPartida = {
  contadorPreguntes: 0,
  respostesUsuari: [],
  totalPreguntes: 0,
};

let preguntesGuardades = [];

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
    }
  else {
    console.log("Resposta incorrecta");
  }


  //https://github.com/alvaroph/tr0_daw

  
  actualitzarMarcador();

  if (estatDeLaPartida.contadorPreguntes === estatDeLaPartida.totalPreguntes) {
    document.getElementById("btnResultats").classList.remove("hidden");
  }
}

function renderJuego(data) {
  let contenidor = document.getElementById("partida");
  let htmlString = "";

  estatDeLaPartida.totalPreguntes = data.preguntes.length;

  for (let i = 0; i < data.preguntes.length; i++) {
    htmlString += `<h3>${data.preguntes[i].pregunta}</h3>`;
    htmlString += `<img class="bandera" src="${
      data.preguntes[i].imatge
    }" alt="imatge pregunta ${i + 1}"><br>`;

    let respostes = [
      data.preguntes[i].resposta_correcta,
      ...data.preguntes[i].respostes_incorrectes,
    ];
    respostes.sort(() => Math.random() - 0.5);


    preguntesGuardades[i] = {
      respostes: respostes,
      correcta: data.preguntes[i].resposta_correcta
    };

    for (let j = 0; j < respostes.length; j++) {
      htmlString += `<button class="resposta" data-pregunta="${
        i + 1
      }" data-resposta="${j + 1}">${respostes[j]}</button>`;
    }
  }
  contenidor.innerHTML = htmlString;
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