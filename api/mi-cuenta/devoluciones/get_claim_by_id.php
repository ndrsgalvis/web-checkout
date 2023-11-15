
<?php
require_once('../../../wp-load.php');

function get_name_state($id_state)
{
    $states = [
        "1" => "Envío",
        "2" => "En Revisión",
        "3" => "Respuesta",
        "4" => "Solución"
    ];
    return $states[$id_state] ?? "En Revisión";
}

function get_name_reason($id_reason)
{
    $reasons = [
        "1" => "No es el producto que pedí",
        "2" => "No puedo ver bien con los lentes",
        "3" => "El producto llegó en mal estado",
        "4" => "Me hizo falta un producto",
        "5" => "El producto jamás llegó",
        "6" => "Otro"
    ];
    return $reasons[$id_reason] ?? "Otro";
}

function get_claim()
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
                $query = "SELECT * FROM wp_giko_claim WHERE id = %d;";
                $claim = (array) $wpdb->get_results($wpdb->prepare($query, $id));
                if (count($claim) > 0) :
                    $claim = (array) $claim[0];
                    $claim["id"] = (int) $claim["id"];
                    $claim["id_order"] = (int) $claim["id_order"];
                    $claim["claim_reason_name"] = get_name_reason($claim["complaint_reason"]);
                    $claim["complaint_reason"] = (int) $claim["complaint_reason"];
                    $claim["claim_status_name"] = get_name_state($claim["claim_status"]);
                    $claim["claim_status"] = (int) $claim["claim_status"];
                    $claim["photo_claim"] = json_decode($claim["photo_claim"], true);
                    $claim["photo_claim"] = $claim["photo_claim"]["fotos"];
                endif;
                $res = ["ok" => true, "data" => $claim];
                http_response_code(200);
            endif;
        endif;
    } catch (Exception $e) {
        $res = ["ok" => false, "message" => $e->getMessage(), "data" => []];
        http_response_code(500);
    } finally {
        header("Content-Type: application/json");
        return json_encode($res, JSON_UNESCAPED_UNICODE);
    }
}

$allowed_origins = array('http://192.168.50.46:5500', 'http://127.0.0.1:5500', 'https://gikolab.com');

header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Methods: GET, OPTIONS");
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $claim = get_claim();
    echo $claim;
} else {
    http_response_code(405);
    echo json_encode(["ok" => false, "message" => "Metodo no permitido", "data" => []]);
}