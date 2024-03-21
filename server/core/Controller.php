<?php
    class Controller{
        function model($model){
            if(file_exists(__DIR_ROOT.'/app/models/'.$model.'.php')) {
                require_once __DIR_ROOT.'/app/models/'.$model.'.php';
                if(class_exists($model)) {
                    $model = new $model();
                    return $model;
                }
            }
            return false;
        }
        function render($view, $data=[]){
            extract($data);
            if(file_exists(__DIR_ROOT.'/app/views/'.$view.'.php')) {
                require_once __DIR_ROOT.'/app/views/'.$view.'.php';
            }
        }
        function base64url_encode($str){
            return rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
        }
        function getAuthorizationHeader(){
            $headers = null;
            if (isset($_SERVER['Authorization'])) {
                $headers = trim($_SERVER["Authorization"]);
            }
            else if (isset($_SERVER['HTTP_AUTHORIZATION'])) { //Nginx or fast CGI
                $headers = trim($_SERVER["HTTP_AUTHORIZATION"]);
            } elseif (function_exists('apache_request_headers')) {
                $requestHeaders = apache_request_headers();
                // Server-side fix for bug in old Android versions (a nice side-effect of this fix means we don't care about capitalization for Authorization)
                $requestHeaders = array_combine(array_map('ucwords', array_keys($requestHeaders)), array_values($requestHeaders));
                //print_r($requestHeaders);
                if (isset($requestHeaders['Authorization'])) {
                    $headers = trim($requestHeaders['Authorization']);
                }
            }
            return $headers;
        }
        function getBearerToken($getAuthHeader) {
        	$headers = $getAuthHeader;
        	// HEADER: Get the access token from the header
        	if (!empty($headers)) {
        		if (preg_match('/Bearer\s(\S+)/', $headers, $matches)) {
        			return $matches[1];
        		}
        	}
        	return null;
        }
        function is_jwt_valid($jwt) {
            $valid = false;
            $secret='Caily-Group@;+/*95';
            $tokenParts = explode('.', $jwt);

            if ($tokenParts[0] === '') {
                echo "<h1>"."Access is denied. Please log in!"."</h1>";
            } else {
                $header = base64_decode($tokenParts[0]);
                $payload = base64_decode($tokenParts[1]);
                $signature_provided = $tokenParts[2];

                $base64_url_header = rtrim(strtr(base64_encode($header), '+/', '-_'), '=');
                $base64_url_payload = rtrim(strtr(base64_encode($payload), '+/', '-_'), '=');
                $signature = hash_hmac('SHA256',  $base64_url_header . '.' . $base64_url_payload, $secret, true);
                $base64_url_signature = rtrim(strtr(base64_encode($signature), '+/', '-_'), '=');

                $is_signature_valid = ($base64_url_signature === $signature_provided); 
                if(!$is_signature_valid) {
                    return false;
                } else {
                    return true;
                }
            }
        }
    }
?>