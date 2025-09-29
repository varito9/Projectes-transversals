<?php
header("Content-Type: application/json");
require_once "db.php";

$sql = "SELECT * FROM preguntes"; // Escribimos la consulta
$result = mysqli_query($conn, $sql); // Ejecutamos la consulta

$preguntes = []; // Array para almacenar las preguntas


//result muestra toda la consulta 
//p muestra cada fila de la consulta
while ($p = mysqli_fetch_assoc($result)) {
    $idPregunta = $p['id'];

    // Obtenemos respuestas comprobando que coincida el id con la pregunta
    $sqlRes = "SELECT id, texto, es_correcta FROM respostes WHERE id_pregunta = $idPregunta";
    $res = mysqli_query($conn, $sqlRes);

    $answers = [];
    $correct_index = -1;
    $i = 0;

    while ($r = mysqli_fetch_assoc($res)) {
        $answers[] = $r['texto'];
        if ($r['es_correcta'] == 1) {
            $correct_index = $i;
        }
        $i++;
    }

    $preguntes[] = [
        "id" => $idPregunta,
        "question_text" => $p['texto'],
        "answers" => $answers,
        "correct_index" => $correct_index
    ];
}

echo json_encode($preguntes);
