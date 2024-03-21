<?php
    class Login extends Controller{
        function index($userid='', $password=''){
            return $this->model('LoginModel')->Login($userid, $password);
        }
        // function login(){
        //     $this->render('login');
        // }
    }
?>