function actualitzarMarcador(){
let marcador = document.getElementById("marcador");
marcador.innerHTML = `Pregunta ${estatDeLaPartida.contadorPreguntes} Respostes ${estatDeLaPartida}`
}




function marcarRespuesta(numPregunta, numRespuesta) {
    console.log("Pregunta " + numPregunta + "Resposta " + numRespuesta);
    
}
window.marcarRespuesta = marcarRespuesta;




function renderJuego(data){

// console.log(data);

let contenidor = document.getElementById("questionari");
let htmlString = "";

for (let i = 0; i < data.preguntes.length; i++) {
    htmlString += `<h3>${data.preguntes[i].pregunta}</h3>`;
    htmlString += `<img class='bandera' src="${data.preguntes[i].imatge}" alt="imatge pregunta ${i+1}"><br>`;

    
    //operador spread combina arrays y strings 
    let respostes = [data.preguntes[i].resposta_correcta, ...data.preguntes[i].respostes_incorrectes];
    
    // Mezclar todas las preguntas para que no esten siempre en la misma posición
    respostes.sort(() => Math.random() - 0.5);

    for (let j = 0; j < respostes.length; j++) {
        htmlString += `<button onclick="marcarRespuesta(${i+1}, ${j+1})">${respostes[j]}</button>`;
        }
    }
    contenidor.innerHTML=htmlString;
}


window.addEventListener('DOMContentLoaded', (event) =>{


fetch('js/data.json')
  .then(response => response.json())
  .then(preg => console.log(preg));

})
