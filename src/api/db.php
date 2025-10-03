<?php
ini_set('display_errors', 1);
error_reporting(E_ALL);

$servername = "localhost";
$username = "a24alvsalalv_pr0";
$password = "bD=G5X&[@(K5Fnmg";
$database = "a24alvsalalv_pr0";

$conn = new mysqli($servername, $username, $password, $database);

if ($conn->connect_error) {
    die("Connexió fallida: " . $conn->connect_error);
}

?>