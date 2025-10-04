<?php
header("Content-Type: application/json");
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);

$id = intval($data['id']);
$texto = mysqli_real_escape_string($conn, $data['question']);
$answers = $data['answers'];
$correct = intval($data['correct']);
$imatge = isset($data['image']) ? mysqli_real_escape_string($conn, $data['image']) : null;

if ($imatge !== null) {
    $sql = "UPDATE preguntes SET texto = '$texto', imatge = '$imatge' WHERE id = $id";
} else {
    $sql = "UPDATE preguntes SET texto = '$texto' WHERE id = $id";
}
mysqli_query($conn, $sql);

mysqli_query($conn, "DELETE FROM respostes WHERE id_pregunta = $id");

foreach ($answers as $i => $ans) {
    $ans = mysqli_real_escape_string($conn, $ans);
    $es_correcta = ($i === $correct) ? 1 : 0;
    $sqlR = "INSERT INTO respostes (id_pregunta, texto, es_correcta) 
             VALUES ($id, '$ans', $es_correcta)";
    mysqli_query($conn, $sqlR);
}

echo json_encode(["status" => "ok"]);
