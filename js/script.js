import data from'./data.js';

function marcarRespuesta(numPregunta, numRespuesta) {
    console.log("Pregunta " + numPregunta + "Resposta " + numRespuesta);
    
}
window.marcarRespuesta = marcarRespuesta;





//alert("hola")
console.log(data);

let contenidor = document.getElementById("questionari");
let htmlString = "";

for (let i = 0; i < data.preguntes.length; i++) {
    htmlString += `<h3>${data.preguntes[i].pregunta}</h3>`;
    htmlString += `<img src="${data.preguntes[i].imatge}" alt="imatge pregunta ${i+1}"><br>`;

    
    // Combinar respuesta correcta e incorrectas
    let respostes = [data.preguntes[i].resposta_correcta, ...data.preguntes[i].respostes_incorrectes];
    
    // Mezclar aleatoriamente
    respostes.sort(() => Math.random() - 0.5);

    for (let j = 0; j < respostes.length; j++) {
        htmlString += `<button onclick="marcarRespuesta(${i+1}, ${j+1})">${respostes[j]}</button>`;
    }
}
contenidor.innerHTML=htmlString;
