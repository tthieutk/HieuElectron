<?php
    session_start();

    define('__DIR_ROOT', __DIR__);

    if(!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] == 'on'){
        $web_root = 'https://'.$_SERVER['HTTP_HOST'];
    } else {
        $web_root = 'http://'.$_SERVER['HTTP_HOST'];
    }

    define('__WEB_ROOT', $web_root);

    // Auto Load Config
    $configs_dir = scandir('configs');
    if(!empty($configs_dir)) {
        foreach($configs_dir as $item){
            if($item!='.' && $item!='..' && file_exists('configs/'.$item)){
                require_once(__DIR__.'/configs/'.$item);
            }
        }
    }

    // Middleware
    require_once(__DIR__.'/core/Middleware.php');

    require_once(__DIR__.'/core/Route.php');

    // Load Session Class
    require_once(__DIR__.'/core/Session.php');

    require_once(__DIR__.'/app/App.php');

    require_once(__DIR__.'/core/Controller.php');
    require_once(__DIR__.'/core/Model.php');

    // Load Request
    require_once(__DIR__.'/core/Request.php');

    // Load Response
    require_once(__DIR__.'/core/Response.php');
    $app = new App();
?>