<?php
    error_reporting(E_ALL);
    ini_set('display_errors', 1);
    // Website you wish to allow to connect
    header('Access-Control-Allow-Origin: *');

    // Request methods you wish to allow
    header('Access-Control-Allow-Methods: GET, POST, OPTIONS, PUT, PATCH, DELETE');

    // Request headers you wish to allow
    header('Access-Control-Allow-Headers: X-Requested-With,content-type, Authorization');

    // Set to true if you need the website to include cookies in the requests sent
    // to the API (e.g. in case you use sessions)
    header('Access-Control-Allow-Credentials', true);

    /**
     *Database settings
    */
    // HOSTNAME
    define('DB_HOSTNAME', 'localhost');
    // DATABASE
    define('DB_DATABASE', 'cailygroupdb');
    // USERNAME
    define('DB_USERNAME', 'root');
    // PASSWORD
    define('DB_PASSWORD', '');
    // PORT
    define('DB_PORT', '');

    // if($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    //     header('HTTP/1.1 200 OK');
    // }

    $conn = mysqli_connect(DB_HOSTNAME, DB_USERNAME, DB_PASSWORD, DB_DATABASE);
    if($conn===false) {
        die("ERROR: Could Not Connect".mysqli_connect_error());
    }
?>