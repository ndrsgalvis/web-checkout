<?php
require_once('../../wp-load.php');

global $wpdb;

$query1 = $wpdb->prepare(
    "SELECT * FROM wp_giko_user_preferences_form"
);
$query2 = $wpdb->prepare(
    "SELECT idquestion, idmaterial, name  FROM wp_giko_user_preferences_material a
    INNER JOIN wp_giko_materials b ON b.id = a.idmaterial"
);
$query3 = $wpdb->prepare(
    "SELECT idquestion, idfilter, name  FROM wp_giko_user_preferences_filters a
    INNER JOIN wp_giko_filters b ON b.id = a.idfilter"
);

// Preguntas
$results1 = $wpdb->get_results($query1);
// Relación materiales
$results2 = $wpdb->get_results($query2);
// Relacion fIltros
$results3 = $wpdb->get_results($query3);

$json = Array();
foreach ($results1 as $questions) {
    $json[$questions->id] = [
        "pregunta" => $questions->question,
        "recomendaciones" => [
           "filtros" => [
				// Put filters by id
           ],
           "material" => [
           		// Put materials by id
           ]
        ]
        ];
}

foreach ($results2 as $results) {
    $json[$results->idquestion]['recomendaciones']['material'] += [
        $results->idmaterial => $results->name,
    ];
}
foreach ($results3 as $results) {
    $json[$results->idquestion]['recomendaciones']['filtros'] += [
        $results->idfilter => $results->name,
    ];
}

echo json_encode($json);