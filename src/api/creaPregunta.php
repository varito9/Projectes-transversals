<?php
header("Content-Type: application/json");
require_once "db.php";

// Para recibir JSON + archivo, usamos $_FILES para la imagen
$data = json_decode(file_get_contents("php://input"), true);

$texto = mysqli_real_escape_string($conn, $data['question']);
$answers = $data['answers'];
$correct = intval($data['correct']);
$imatge = isset($data['image']) ? mysqli_real_escape_string($conn, $data['image']) : "";

// Insertamos la pregunta
$sql = "INSERT INTO preguntes (texto, imatge) VALUES ('$texto', '$imatge')";
mysqli_query($conn, $sql);
$idPregunta = mysqli_insert_id($conn);

// Insertamos respuestas
foreach ($answers as $i => $ans) {
    $ans = mysqli_real_escape_string($conn, $ans);
    $es_correcta = ($i === $correct) ? 1 : 0;
    $sqlR = "INSERT INTO respostes (id_pregunta, texto, es_correcta) 
             VALUES ($idPregunta, '$ans', $es_correcta)";
    mysqli_query($conn, $sqlR);
}

echo json_encode(["status" => "ok"]);
