<?php
header("Content-Type: application/json");
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

if (!$data || !is_array($data)) {
    echo json_encode(["error" => "Dades no vàlides"]);
    exit;
}

$correctes = 0;
$total = count($data);

foreach ($data as $respostaUsuari) {
    $idPregunta = intval($respostaUsuari['idPregunta']);
    $respostaText = mysqli_real_escape_string($conn, $respostaUsuari['respostaText']);

    // Recuperar la resposta correcta desde la BD
    $sql = "SELECT text FROM respostes WHERE id_pregunta = $idPregunta AND es_correcta = 1 LIMIT 1";
    $result = mysqli_query($conn, $sql);

    if ($result && $row = mysqli_fetch_assoc($result)) {
        $respostaCorrecta = $row['text'];

        if ($respostaText === $respostaCorrecta) {
            $correctes++;
        }
    }
}

echo json_encode([
    "correctes" => $correctes,
    "total" => $total
]);
