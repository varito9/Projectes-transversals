<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$env = parse_ini_file(__DIR__ . '/.env');

$servername = $env['DB_HOST'];
$username   = $env['DB_USER'];
$password   = $env['DB_PASS'];
$database   = $env['DB_NAME'];

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    error_log("DB Connection failed: " . $conn->connect_error);
    exit("Error de conexión a la base de datos.");
}
?>
