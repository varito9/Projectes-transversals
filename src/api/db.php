<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$servername = "db";
$username = "usuario";
$password = "password";
$database = "mi_bd";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connexió fallida: " . $conn->connect_error);
}

?>