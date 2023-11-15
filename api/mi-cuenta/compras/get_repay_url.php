<?php
require_once('../../../wp-load.php');

function get_repay_url()
{
    try {
        $res = ["ok" => false, "message" => "No ha iniciado sesión", "data" => []];
        $order_id = isset($_GET['order_id']) ? $_GET['order_id'] : null;
        $user_id = get_current_user_id();
        $reorder_url = "";
        if ($user_id == 0 || $order_id == null) : http_response_code(400);
        else :
            $order = wc_get_order($order_id);
            if ($order && $order->has_status('completed')) :
                $items = $order->get_items();
                $reorder_cart = WC()->cart;
                foreach ($items as $item) {
                    $product_id = $item->get_product_id();
                    $quantity = $item->get_quantity();
                    $variation_id = $item->get_variation_id();
                    $reorder_cart->add_to_cart($product_id, $quantity, $variation_id);
                }
                $reorder_url = wc_get_checkout_url();
                $res = ["ok" => true, "data" => $reorder_url];
            endif;
            http_response_code(200);
            return json_encode($res);
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
    $url = get_repay_url();
    echo $url;
} else {
    http_response_code(405);
    echo json_encode(["ok" => false, "message" => "Metodo no permitido", "data" => []]);
}