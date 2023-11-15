<?php
require_once('../../wp-load.php');

global $wpdb;

if(isset($_GET['age']) || isset($_GET['id']) || 
isset($_GET['cylod']) || isset($_GET['sphod']) ||
isset($_GET['cyloi']) || isset($_GET['sphoi'])){
    $id = $_GET['id'];
    $age = $_GET['age'];
    
    $params_od = [
         $_GET['sphod'],
         $_GET['cylod'],
    ];

    $params_oi = [
         $_GET['sphoi'],
         $_GET['cyloi'],
    ];

    $params = [$params_oi, $params_od];
};

function create_json_variations($datos){
    $menu = array_reduce($datos, function($accu, $item){
        $id_lenses = $item['id_lenses'];
        $lenses_name = $item['lenses_name'];
        $lenses_description = $item['lenses_description'];
        $id_variation = $item['id_variation'];
        $variation_name = $item['variation_name'];
        $variation_description = $item['variation_description'];

        if(!isset($accu[$lenses_name])){
            $accu[$lenses_name] = [
                'id' => $id_lenses,
                'description' => $lenses_description,
                'filters' => []
            ];
        }

        $accu[$lenses_name]['filters'][$variation_name]['id_variation'] = [
            $id_variation,
        ];
        $accu[$lenses_name]['filters'][$variation_name]['description'] = [
            $variation_description 
        ];

        return $accu;
    }, []);
    
    return json_encode($menu);
}

function create_json_res($datos, $value){
    $menu = array_reduce($datos, function($accu, $item) use ($value){
        $lenses = $item['lenses'];
        $filter = $item['filters'];
        $filter_option = $item['filter_option'];
        
        $filter_option_variation = $item['filter_option_variation'];
        $filter_option_variation_add = $item['filter_option_variation_add'];
        
        if(!isset($accu[$lenses])){
            $accu[$lenses] = [
                'info' => $item['lenses_info'],
                'description' => $item['lenses_description'],
                'filters' => [],
            ];
            
            if($filter_option_variation_add){
                if(!isset($accu[$lenses]['filters'][$filter][$filter_option][$filter_option_variation][$filter_option_variation_add])){
                    $accu[$lenses]['filters'][$filter][$filter_option][$filter_option_variation][$filter_option_variation_add] = [];
                }   
            }elseif($filter_option_variation){
                if(!isset($accu[$lenses]['filters'][$filter][$filter_option][$filter_option_variation])){
                    $accu[$lenses]['filters'][$filter][$filter_option][$filter_option_variation] = [];
                }   
            }elseif($filter_option){
                if(!isset($accu[$lenses]['filters'][$filter][$filter_option])){
                    $accu[$lenses]['filters'][$filter][$filter_option]= [];
                }
            }else{
                if(!isset($accu[$lenses]['filters'][$filter])){
                   $accu[$lenses]['filters'][$filter] = [];
                }
            }
        }
  
       if($filter_option){

        if($filter_option_variation_add){
            if($item['cil_max']){
            if($value[0][0] <= $item['cil_max'] && $value[0][0] >= ('-' . $item['cil_min']) &&  $value[0][1] <= $item['axis'] &&
            $value[1][0] <= $item['cil_max'] && $value[1][0] >= ('-' . $item['cil_min']) &&  $value[1][1] <= $item['axis']){
                $accu[$lenses]['filters'][$filter][$filter_option][$filter_option_variation][$filter_option_variation_add][] = [
                    $item['material'] => $item['price'],
                    'description' => $item['material_description'],
                    'terminado' => 'true',
                    'info' => $item['material_info'],
                ];
            }
        
            }else{
                $accu[$lenses]['filters'][$filter][$filter_option][$filter_option_variation][$filter_option_variation_add][] = [
                    $item['material'] => $item['price'],
                    'description' => $item['material_description'],
                    'info' => $item['material_info'],
                ];
            }
    
            $accu[$lenses]['filters'][$filter][$filter_option][$filter_option_variation][$filter_option_variation_add]['description'] = [
                $item['filters_description'],
            ];
            $accu[$lenses]['filters'][$filter][$filter_option][$filter_option_variation][$filter_option_variation_add]['info'] = [
                $item['material_info'],
            ];
        }elseif($filter_option_variation){
                if($item['cil_max']){
                        if($value[0][0] <= $item['cil_max'] && $value[0][0] >= ('-' . $item['cil_min']) &&  $value[0][1] <= $item['axis'] &&
                            $value[1][0] <= $item['cil_max'] && $value[1][0] >= ('-' . $item['cil_min']) &&  $value[1][1] <= $item['axis']){
                            $accu[$lenses]['filters'][$filter][$filter_option][$filter_option_variation][] = [
                                $item['material'] => $item['price'],
                                'description' => $item['material_description'],
                                'terminado' => 'true',
                                'info' => $item['material_info'],
                            ];
                        }
                    
                }else{
                    $accu[$lenses]['filters'][$filter][$filter_option][$filter_option_variation][] = [
                        $item['material'] => $item['price'],
                        'description' => $item['material_description'],
                        'info' => $item['material_info'],
                    ];
                }

                $accu[$lenses]['filters'][$filter]['description'] = [
                    $item['filters_description'],
                ];    
                
                $accu[$lenses]['filters'][$filter][$filter_option]['description'] = [
                    $item['filter_option_description'],
                ];
                
                $accu[$lenses]['filters'][$filter][$filter_option][$filter_option_variation]['description'] = [
                    $item['filter_option_variation_description'],
                ];


                // 
                $accu[$lenses]['filters'][$filter]['info'] = [
                    $item['filters_info'],
                ];    
                
                $accu[$lenses]['filters'][$filter][$filter_option]['info'] = [
                    $item['filter_option_info'],
                ];
                
                $accu[$lenses]['filters'][$filter][$filter_option][$filter_option_variation]['info'] = [
                    $item['filter_option_variation_info'],
                ];
                    
            }else{
            
                if($item['cil_max']){
                        if($value[0][0] <= $item['cil_max'] && $value[0][0] >= ('-' . $item['cil_min']) &&  $value[0][1] <= $item['axis'] &&
                        $value[1][0] <= $item['cil_max'] && $value[1][0] >= ('-' . $item['cil_min']) &&  $value[1][1] <= $item['axis']){
                            $accu[$lenses]['filters'][$filter][$filter_option][] = [
                                $item['material'] => $item['price'],
                                'description' => $item['material_description'],
                                'terminado' => 'true',
                                'info' => $item['material_info'],
                            ];
                        }
                    
                }else{
                    
                    $accu[$lenses]['filters'][$filter][$filter_option][] = [
                        $item['material'] => $item['price'],
                        'description' => $item['material_description'],
                        'info' => $item['material_info'],
                    ];
                }
            
                $accu[$lenses]['filters'][$filter]['description'] = [
                    $item['filters_description'],
                ];
                $accu[$lenses]['filters'][$filter]['info'] = [
                    $item['material_info'],
                ];
            }
        }else{
          
            $accu[$lenses]['filters'][$filter]['description'] = [
                $item['filters_description'],
            ];
            $accu[$lenses]['filters'][$filter]['info'] = [
                $item['filters_info'],
            ];

            if($item['cil_max']){

                if($value[0][0] <= $item['cil_max'] && $value[0][0] >= ('-' . $item['cil_min']) &&  $value[0][1] <= $item['axis'] &&
                    $value[1][0] <= $item['cil_max'] && $value[1][0] >= ('-' . $item['cil_min']) &&  $value[1][1] <= $item['axis']){
                    $accu[$lenses]['filters'][$filter][] = [
                        $item['material'] => $item['price'],
                        'description' => $item['material_description'],
                        'terminado' => 'true',
                        'info' => $item['material_info'],
                    ];
                }

            }else{
                $accu[$lenses]['filters'][$filter][] = [
                    $item['material'] => $item['price'],
                    'description' => $item['material_description'],
                    'info' => $item['material_info'],
                ];
            }
        }
        
        return $accu;
    }, []);
    
    return json_encode($menu);
}


if(strlen($id) == 0) $id = null;

if(intval($age) < 40 || $id != null ){
    $query1 =  $wpdb->prepare(
        "SELECT  b.name gama, b.description gama_description, b.info material_info,
		d.id ,d.name lenses, d.description lenses_description, d.info lenses_info,
        c.id, c.name filters, c.description filters_description,  c.info filters_info,
        f.name filter_option, f.description filter_option_description,  f.info filter_option_info,
        g.name filter_option_variation, g.description filter_option_variation_description, g.info filter_option_variation_info,
        h.name filter_option_variation_add, h.description filter_option_variation_description_add, h.info filter_option_variation_info_add,
        e.id, e.name material, e.description material_description, e.info material_info, 
        a.price, a.cil_min, a.cil_max, a.axis
        FROM wp_giko_materials_variations a
        INNER JOIN wp_giko_lense_type_variations b ON b.id = a.idlenses_type_variation
        INNER JOIN wp_giko_filters c ON c.id = a.idfilter
        INNER JOIN wp_giko_lenses d ON d.id = c.idlenses
        INNER JOIN wp_giko_materials e ON e.id = a.idmaterial
        LEFT JOIN wp_giko_filters_options f ON f.id = a.idfilter_option
        LEFT JOIN wp_giko_filters_options_variations g ON g.id = a.idfilter_option_variation 
        LEFT JOIN wp_giko_filters_options_variations_add h ON h.id = a.additional_option 
        WHERE b.id = $id
        ORDER BY d.id, c.id, e.id ASC");
    
    $results1 = (array) $wpdb->get_results($query1);
    $data = json_decode(json_encode($results1), true);
    echo create_json_res($data, $params);
}else{
    $lenses_types = $wpdb->prepare("
    SELECT a.id as id_lenses, a.name lenses_name, a.description lenses_description, b.id id_variation, 
    b.name variation_name, b.description variation_description FROM wp_giko_lense_type a
    INNER JOIN wp_giko_lense_type_variations b ON b.id_lenses_type = a.id");
    
    $res_lenses_types = (array) $wpdb->get_results($lenses_types);
    echo create_json_variations(json_decode(json_encode($res_lenses_types), true));
}