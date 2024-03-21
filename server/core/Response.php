<?php
    class Response{
        function redirect($uri=''){
            $url = __WEB_ROOT.'/'.$uri;
            header("Location:".$url);
            exit;
        }
    }
?>