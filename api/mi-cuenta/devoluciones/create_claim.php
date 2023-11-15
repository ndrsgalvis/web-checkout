<?php
require_once('../../../wp-load.php');


function create_claim()
{
    try {
        $res = ["ok" => false, "message" => "No ha iniciado sesión", "data" => []];
        $user_id = get_current_user_id();
        if ($user_id == 0) {
            http_response_code(400);
        } else {
            $data = file_get_contents('php://input');
            $data = json_decode($data, true);
            global $wpdb;
            $wpdb->get_results($wpdb->prepare(
                "INSERT INTO wp_giko_claim (id_order, complaint_reason, claim_description, photo_claim) 
                VALUES (%d, %d, %s, %s);",
                $data["id_order"],
                $data["complaint_reason"],
                $data["claim_description"],
                $data["photo_claim"],
            ));
            $res = ["ok" => true, "data" => "Reclamación enviada con éxito"];
            http_response_code(200);
        }
    } catch (Exception $e) {
        $res = ["ok" => false, "message" => $e->getMessage(), "data" => []];
        http_response_code(500);
    } finally {
        header("Content-Type: application/json");
        return json_encode($res);
    }
}

$allowed_origins = array('http://192.168.50.46:5500', 'http://127.0.0.1:10048', 'http://localhost:10048',  'https://gikolab.com');

header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Methods: POST, OPTIONS");
if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $create_claim = create_claim();
    echo $create_claim;
} else {
    http_response_code(405);
    echo json_encode(["ok" => false, "message" => "Metodo no permitido", "data" => []]);
}