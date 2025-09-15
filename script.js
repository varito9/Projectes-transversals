import data from"./data.js";
alert("hola")
console.log(data);
let contenidor=document.getElementById("questionari");

htmlString="";

for(let i = 0; i< data.preguntes.lenght; i++){
    htmlString += `<h3> ${data.preguntes[i].pregunta}</h3>`;

}
contenidor.innerHTML=htmlString;
