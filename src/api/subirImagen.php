<?php
header("Content-Type: application/json");

// Carpeta donde se guardarán las imágenes
$targetDir = "../uploads/";
if (!is_dir($targetDir)) mkdir($targetDir, 0777, true);

if (!isset($_FILES['imagen'])) {
    echo json_encode(["status"=>"error", "msg"=>"No hay archivo"]);
    exit;
}

$fileName = time() . "_" . basename($_FILES["imagen"]["name"]);
$targetFile = $targetDir . $fileName;

if (move_uploaded_file($_FILES["imagen"]["tmp_name"], $targetFile)) {
    echo json_encode(["status"=>"ok", "path"=>"uploads/" . $fileName]);
} else {
    echo json_encode(["status"=>"error", "msg"=>"No se pudo mover el archivo"]);
}
