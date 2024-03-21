<?php
    $config['app'] = [
        'routeMiddleware' => [
            'users' => AuthMiddleware::class
        ],
        'globalMiddleware' => [
            ParamsMiddleware::class
        ]
    ]
?>