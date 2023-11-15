<?php
require_once('../../wp-load.php');

    global $wpdb;
    
    if ( is_user_logged_in() ) {
        $user_id = get_current_user_id();
	} 
    
    

    $query =  $wpdb->prepare(
        "SELECT * FROM wp_giko_user_formula
        WHERE userid = $user_id AND disabled = 0");
    
    $results = (array) $wpdb->get_results($query);
    echo json_encode($results);