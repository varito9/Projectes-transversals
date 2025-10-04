<?php
header("Content-Type: application/json");
require_once "db.php";

$data = json_decode(file_get_contents("php://input"), true);
$id = intval($data['id']);

// ON DELETE CASCADE ya borra respostes
$sql = "DELETE FROM preguntes WHERE id = $id";
mysqli_query($conn, $sql);

echo json_encode(["status" => "ok"]);
