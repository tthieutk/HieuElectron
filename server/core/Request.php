<?php
    class Request{
        function getMethod(){
            return strtolower($_SERVER['REQUEST_METHOD']);
        }

        function isPost(){
            if($this->getMethod()=='post'){
                return true;
            }
        }

        function isGet(){
            if($this->getMethod()=='get'){
                return true;
            }
        }

        function getFields(){
            $dataFields = [];
            if($this->isGet()){
                if(!empty($_GET)){
                    foreach($_GET as $key=>$value){
                        if(is_array($value)){
                            $dataFields[$key] = filter_input(INPUT_GET, $key, FILTER_SANITIZE_SPECIAL_CHARS, FILTER_REQUIRE_ARRAY);
                        } else {
                            $dataFields[$key] = filter_input(INPUT_GET, $key, FILTER_SANITIZE_SPECIAL_CHARS);
                        }
                    }
                }
            }

            if($this->isPost()){
                if(!empty($_POST)){
                    foreach($_POST as $key=>$value){
                        if(is_array($value)){
                            $dataFields[$key] = filter_input(INPUT_POST, $key, FILTER_SANITIZE_SPECIAL_CHARS, FILTER_REQUIRE_ARRAY);
                        } else {
                            $dataFields[$key] = filter_input(INPUT_POST, $key, FILTER_SANITIZE_SPECIAL_CHARS);
                        }
                    }
                }
            }

            return $dataFields;
        }
    }
?>