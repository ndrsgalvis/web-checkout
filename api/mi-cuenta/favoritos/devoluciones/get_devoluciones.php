<?php
require_once('../../../wp-load.php');

function get_devoluciones()
{
    try {
        $res = ["ok" => false, "message" => "No ha iniciado sesión", "data" => []];
        $user_id = 1;
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
            (SELECT wp_posts.post_title FROM wp_posts WHERE wp_posts.ID = wp_wc_order_product_lookup.variation_id) AS name
            FROM wp_posts
            INNER JOIN wp_postmeta ON wp_posts.ID = wp_postmeta.post_id
            INNER JOIN wp_wc_order_product_lookup ON wp_posts.ID = wp_db.wp_wc_order_product_lookup.order_id
            INNER JOIN wp_yoast_indexable ON wp_yoast_indexable.object_id = wp_wc_order_product_lookup.product_id
            INNER JOIN wp_db.wp_wc_customer_lookup ON wp_db.wp_wc_customer_lookup.user_id = %d
            WHERE wp_posts.post_type = 'shop_order' AND wp_posts.post_status = 'wc-completed' AND wp_wc_order_product_lookup.customer_id = wp_db.wp_wc_customer_lookup.customer_id
            ORDER BY date_purchase DESC;";
            $purchases = (array) $wpdb->get_results($wpdb->prepare($query, $user_id));
            $purchases = array_reduce($purchases, function ($acc, $cur) {
                $cur = (array) $cur;
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
        return json_encode($res);
    }
}

$allowed_origins = array('http://192.168.50.46:5500', 'http://127.0.0.1:5500', 'https://gikolab.com');

header("Access-Control-Allow-Origin: " . $_SERVER['HTTP_ORIGIN']);
header("Access-Control-Allow-Methods: GET, OPTIONS");
if ($_SERVER["REQUEST_METHOD"] === "GET") {
    $purchases = get_devoluciones();
    echo $purchases;
} else {
    http_response_code(405);
    echo json_encode(["ok" => false, "message" => "Metodo no permitido", "data" => []]);
}