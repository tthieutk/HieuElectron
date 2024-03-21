<?php
    class Session{
        static public function data($key, $value=''){
            $sessionKey = self::isInvalid();
            if(!empty($value)){
                $_SESSION[$sessionKey][$key] = $value; //set session
                return true;
            } else {
                if(empty($key)){
                    if(isset($_SESSION[$sessionKey])){
                        return $_SESSION[$sessionKey]; //get all session
                    }
                } else {
                    if(isset($_SESSION[$sessionKey][$key])){
                        return $_SESSION[$sessionKey][$key]; //get session
                    }
                }
            }
        }

        static public function delete($key=''){
            $sessionKey = self::isInvalid();
            if(!empty($key)){
                if(isset($_SESSION[$sessionKey][$key])){
                    unset($_SESSION[$sessionKey][$key]);
                    return true;
                }
                return false;
            } else {
                unset($_SESSION[$sessionKey]);
                return true;
            }
            return false;
        }

        static function isInvalid(){
            global $config;
            if(!empty($config['session'])){
                $sessionConfig = $config['session'];
                if(!empty($sessionConfig['session_key'])){
                    $sessionKey = $sessionConfig['session_key'];
                    return $sessionKey;
                }
            }
        }
    }
?>