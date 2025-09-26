<?php
header("Content-Type: application/json");
require_once "db.php";

// llegim respostes de l’usuari
$data = json_decode(file_get_contents("php://input"), true);

$total = count($data);
$correctes = 0;

foreach ($data as $resposta) {
    $idPregunta = intval($resposta['idPregunta']);
    $index = intval($resposta['index']); // posició seleccionada

    // recuperem respostes
    $sql = "SELECT text, es_correcta FROM respostes WHERE id_pregunta = $idPregunta";
    $res = mysqli_query($conn, $sql);

    $respostes = [];
    while ($r = mysqli_fetch_assoc($res)) {
        $respostes[] = $r;
    }

    // comparem
    if (isset($respostes[$index]) && $respostes[$index]['es_correcta'] == 1) {
        $correctes++;
    }
}

echo json_encode([
    "total" => $total,
    "correctes" => $correctes
]);
