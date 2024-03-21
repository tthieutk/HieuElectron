<?php
    class AuthMiddleware extends Middleware {
        public function handle(){
            if(isset($_SESSION['auth'])) {
                header("Location:" .__WEB_ROOT."/caily/index");
                exit();
            }
        }
    }
?>