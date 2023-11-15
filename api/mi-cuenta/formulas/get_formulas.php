<?php
require_once('../../../wp-load.php');

function get_formulas()
{
    try {
        $res = ["ok" => false, "message" => "No ha iniciado sesión", "data" => []];
        $user_id = get_current_user_id();
        if ($user_id == 0) : http_response_code(400);
        else :
            global $wpdb;
            $query = "SELECT * FROM wp_giko_user_formula WHERE userId = %d AND disabled = 0;";
            $formulas = $wpdb->get_results($wpdb->prepare($query, $user_id));
            $res = ["ok" => true, "data" => $formulas];
            http_response_code(200);
        endif;
    } catch (Exception $e) {
        $res = ["ok" => false, "message" => $e->getMessage(), "data" => []];
        http_response_code(500);
    } finally {
        header("Content-Type: application/json");
        return json_encode($res);
    }
}

$allowed_origins = array('http://192.168.50.46:5500', 'http://127.0.0.1:5500', 'https://gikolab.com');

header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Methods: GET, OPTIONS");
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $formulas = get_formulas();
    echo $formulas;
} else {
    http_response_code(405);
    echo json_encode(["ok" => false, "message" => "Metodo no permitido", "data" => []]);
}