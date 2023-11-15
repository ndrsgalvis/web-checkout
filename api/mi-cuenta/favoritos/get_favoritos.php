<?php
require_once('../../../wp-load.php');

function get_favorite_lenses()
{
    try {
        $res = ["ok" => false, "message" => "No ha iniciado sesión", "data" => []];
        $user_id = get_current_user_id();
        if ($user_id == 0) : http_response_code(400);
        else :
            global $wpdb;
            $query = "SELECT wp_posts.ID, wp_posts.post_title AS title, wp_posts.post_excerpt AS uses, COALESCE(MAX(CASE WHEN wp_postmeta.meta_key = '_price' THEN wp_postmeta.meta_value END), 'Sin precio') AS price, COALESCE(MAX(CASE WHEN wp_postmeta.meta_key = '_sku' THEN wp_postmeta.meta_value END), 'Sin referencia') AS reference, MAX(CASE WHEN wp_term_taxonomy.taxonomy = 'pa_formas' THEN wp_terms.name END) AS shape, MAX(CASE WHEN wp_term_taxonomy.taxonomy = 'pa_usuario' THEN wp_terms.name END) AS gender, MAX(CASE WHEN wp_term_taxonomy.taxonomy = 'pa_marca' THEN wp_terms.name END) AS brand, MAX(CASE WHEN wp_termmeta.meta_key = 'product_attribute_color' THEN wp_termmeta.meta_value END) AS color, wp_yoast_indexable.open_graph_image AS photo, wp_yoast_indexable.permalink AS permalink
            FROM wp_yith_wcwl 
            INNER JOIN wp_posts ON wp_yith_wcwl.prod_id = wp_posts.ID 
            INNER JOIN wp_postmeta ON wp_posts.ID = wp_postmeta.post_id
            INNER JOIN wp_term_relationships ON wp_term_relationships.object_id = wp_posts.ID
            INNER JOIN wp_yoast_indexable ON wp_yoast_indexable.object_id = wp_posts.ID 
            INNER JOIN wp_term_taxonomy ON wp_term_relationships.term_taxonomy_id = wp_term_taxonomy.term_taxonomy_id 
            INNER JOIN wp_terms ON wp_terms.term_id = wp_term_taxonomy.term_id
            INNER JOIN wp_termmeta ON wp_termmeta.term_id = wp_terms.term_id
            WHERE wp_yith_wcwl.user_id = %d AND wp_posts.post_status = 'publish' GROUP BY wp_posts.ID";
            $favorites = $wpdb->get_results($wpdb->prepare($query, $user_id));
            $res = ["ok" => true, "data" => $favorites];
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
    $favorites = get_favorite_lenses();
    echo $favorites;
} else {
    http_response_code(405);
    echo json_encode(["ok" => false, "message" => "Metodo no permitido", "data" => []]);
}