<?php
header("Content-Type: application/json");
require_once "db.php";

$num = isset($_GET['num']) ? intval($_GET['num']) : 5;

// obtenim preguntes aleatòries
$sql = "SELECT * FROM preguntes ORDER BY RAND() LIMIT $num";
$result = mysqli_query($conn, $sql);

$preguntes = [];
while ($p = mysqli_fetch_assoc($result)) {
    $idPregunta = $p['id'];

    // respostes associades
    $sqlRes = "SELECT id, text FROM respostes WHERE id_pregunta = $idPregunta";
    $res = mysqli_query($conn, $sqlRes);

    $respostes = [];
    while ($r = mysqli_fetch_assoc($res)) {
        $respostes[] = $r['text'];
    }

    $preguntes[] = [
        "id" => $idPregunta,
        "pregunta" => $p['text'],
        "imatge" => $p['imatge'],
        "respostes" => $respostes
    ];
}

echo json_encode(["preguntes" => $preguntes]);
