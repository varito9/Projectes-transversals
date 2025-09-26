<?php
header("Content-Type: application/json");
require_once "db.php";

$sql = "SELECT p.id AS id_pregunta, p.text AS pregunta, p.imatge,
               r.id AS id_resposta, r.text AS resposta, r.es_correcta
        FROM preguntes p
        JOIN respostes r ON p.id = r.id_pregunta
        ORDER BY p.id";

$result = mysqli_query($conn, $sql);

$preguntes = [];
while ($row = mysqli_fetch_assoc($result)) {
    $id = $row['id_pregunta'];
    if (!isset($preguntes[$id])) {
        $preguntes[$id] = [
            "id" => $id,
            "pregunta" => $row['pregunta'],
            "imatge" => $row['imatge'],
            "respostes" => []
        ];
    }
    $preguntes[$id]["respostes"][] = [
        "id" => $row['id_resposta'],
        "text" => $row['resposta'],
        "correcta" => $row['es_correcta']
    ];
}

echo json_encode(array_values($preguntes));
