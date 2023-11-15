
<?php
require_once('../../../wp-load.php');

function delete_favorite()
{
    try {
        $res = ["ok" => false, "message" => "No ha iniciado sesión", "data" => []];
        $user_id = get_current_user_id();
        if ($user_id == 0) : http_response_code(400);
        else :
            global $wpdb;
            $id = isset($_GET['id']) ? $_GET['id'] : null;
            if ($id === null) :
                $res = ["ok" => false, "message" => "Faltan datos", "data" => []];
            else :
                $query = "UPDATE wp_giko_user_formula SET wp_giko_user_formula.disabled = 1 WHERE wp_giko_user_formula.id = %d";
                $wpdb->get_results($wpdb->prepare($query, $id));
                $res = ["ok" => true, "message" => "", "data" => []];
                http_response_code(200);
            endif;
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
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
    echo delete_favorite();
} else {
    http_response_code(405);
    echo json_encode(["ok" => false, "message" => "Metodo no permitido", "data" => []]);
}