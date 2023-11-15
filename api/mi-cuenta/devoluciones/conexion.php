<?php
require_once('../../../wp-load.php');

function devolucion()
{
    try {
        
        $res = ["ok" => false, "message" => "No ha iniciado sesión", "data" => []];
        if ($_SERVER["REQUEST_METHOD"] === "POST") {
            $nombre = $_POST['nombre'];
            $correo = $_POST['correo'];
            $producto = $_POST['producto'];
            $descripcion = $_POST['descripcion'];

            $res = ["ok" => true, "message" => "Gracias por tu reclamo, $nombre. Lo hemos registrado."];
            http_response_code(200);
        } else {
            $res = ["ok" => false, "message" => "Método no permitido"];
            http_response_code(405);
        }
    } catch (Exception $e) {
        $res = ["ok" => false, "message" => $e->getMessage()];
        http_response_code(500);
    } finally {
        header("Content-Type: application/json");
        return json_encode($res);
    }
}

$allowed_origins = array('http://192.168.50.46:5501', 'http://127.0.0.1:5501', 'https://gikolab.com');

header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Methods: POST, OPTIONS");

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $response = devolucion();
    echo $response;
} else {
    http_response_code(405);
    echo json_encode(["ok" => false, "message" => "Método no permitido"]);
}