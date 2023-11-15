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

function get_recent_purchases()
{
    try {
        $res = ["ok" => false, "message" => "No ha iniciado sesión", "data" => []];
        $user_id = get_current_user_id();
        if ($user_id == 0) : http_response_code(400);
        else :
            global $wpdb;
            $query = "SELECT DISTINCT
            wp_posts.ID AS order_id,
            wp_posts.post_date AS date_purchase,
            date_add(wp_posts.post_date, interval 8 day) AS deadline,
            MAX(CASE WHEN wp_postmeta.meta_key = '_payment_method_title' THEN wp_postmeta.meta_value END) OVER (PARTITION BY  wp_posts.ID) AS payment_method,
            MAX(CASE WHEN wp_postmeta.meta_key = '_billing_email' THEN wp_postmeta.meta_value END) OVER (PARTITION BY  wp_posts.ID) AS email,
            MAX(CASE WHEN wp_postmeta.meta_key = '_order_total' THEN wp_postmeta.meta_value END) OVER (PARTITION BY  wp_posts.ID) AS total,
            wp_wc_order_product_lookup.product_qty AS amount,
            wp_wc_order_product_lookup.product_gross_revenue AS gross_price, 
            wp_yoast_indexable.open_graph_image AS photo,
            wp_yoast_indexable.permalink AS permalink,
            (SELECT wp_posts.post_title FROM wp_posts WHERE wp_posts.ID = wp_wc_order_product_lookup.variation_id) AS name,
            wp_giko_claim.date_start AS date_start_claim,
            wp_giko_claim.complaint_reason,
            wp_giko_claim.claim_description,
            wp_giko_claim.photo_claim,
            wp_giko_claim.id AS id_claim,
            wp_giko_claim.claim_status,
            wp_giko_user_formula_order.options
            FROM wp_posts
            INNER JOIN wp_postmeta ON wp_posts.ID = wp_postmeta.post_id
            INNER JOIN wp_wc_order_product_lookup ON wp_posts.ID = wp_db.wp_wc_order_product_lookup.order_id
            INNER JOIN wp_yoast_indexable ON wp_yoast_indexable.object_id = wp_wc_order_product_lookup.product_id
            INNER JOIN wp_wc_product_meta_lookup ON wp_wc_product_meta_lookup.product_id = wp_wc_order_product_lookup.product_id
            INNER JOIN wp_db.wp_wc_customer_lookup ON wp_db.wp_wc_customer_lookup.user_id = %d
            LEFT JOIN wp_giko_user_formula_order ON wp_giko_user_formula_order.sku = wp_wc_product_meta_lookup.sku
            LEFT JOIN wp_giko_claim ON wp_giko_claim.id_order = wp_posts.ID            
            WHERE wp_posts.post_type = 'shop_order'
            AND wp_posts.post_status = 'wc-completed' AND wp_wc_order_product_lookup.customer_id = wp_db.wp_wc_customer_lookup.customer_id 
            AND wp_giko_user_formula_order.options != 'null'
            ORDER BY date_purchase DESC;";
            $purchases = (array) $wpdb->get_results($wpdb->prepare($query, $user_id));
            $purchases = array_reduce($purchases, function ($acc, $cur) {
                $cur = (array) $cur;
                $cur["options"] = json_decode($cur["options"], true);
                $cur["claim_reason_name"] = get_name_reason($cur["complaint_reason"]);
                if (array_key_exists($cur["order_id"], $acc)) :
                    array_push($acc[$cur["order_id"]]["products"], $cur);
                else :
                    $acc[$cur["order_id"]] = ["products" => [$cur]];
                endif;
                return $acc;
            }, []);
            $purchases = array_values($purchases);
            $purchases = array_map(function ($purchase) {
                $purchase["order_id"] = $purchase["products"][0]["order_id"];
                $purchase["email"] = $purchase["products"][0]["email"];
                $purchase["date_purchase"] = $purchase["products"][0]["date_purchase"];
                $purchase["deadline"] = $purchase["products"][0]["deadline"];
                $purchase["total"] = $purchase["products"][0]["total"];
                $purchase["payment_method"] = $purchase["products"][0]["payment_method"];
                $purchase["id_claim"] = $purchase["products"][0]["id_claim"];
                $purchase["date_start_claim"] = $purchase["products"][0]["date_start_claim"];
                $purchase["claim_status"] = get_name_state($purchase["products"][0]["claim_status"]);
                $purchase["claim_status_id"] = $purchase["products"][0]["claim_status"];
                $purchase["claim_reason_name"] = $purchase["products"][0]["claim_reason_name"];
                $purchase["claim_description"] = $purchase["products"][0]["claim_description"];
                $purchase["photo_claim"] = json_decode($purchase["products"][0]["photo_claim"], true);
                $purchase["photo_claim"] = $purchase["photo_claim"]["fotos"];
                return $purchase;
            }, $purchases);
            $res = ["ok" => true, "data" => $purchases];
            http_response_code(200);
            return json_encode($res);
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
    $purchases = get_recent_purchases();
    echo $purchases;
} else {
    http_response_code(405);
    echo json_encode(["ok" => false, "message" => "Metodo no permitido", "data" => []]);
}