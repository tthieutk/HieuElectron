<?php
    class Users extends Controller{
        function __construct(){
            $getAuthHeader = Controller::getAuthorizationHeader();
            $getBearerToken = Controller::getBearerToken($getAuthHeader);
            return $getBearerToken;
        }
        
        function index(){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('UsersModel')->getList();
            }
        }

        function detail($id=''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('UsersModel')->getDetail($id);
            }
        }

        function add($userid='', $password='', $realname='', $authority='', $user_group=''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('UsersModel')->postAdd($userid, $password, $realname, $authority, $user_group);
            }
        }

        function edit($id=''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('UsersModel')->getEdit($id);
            }
        }

        function update($id='', $userid='', $password='', $passwordNew='', $realname='', $authority='', $user_group=''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('UsersModel')->postUpdate($id, $userid, $password, $passwordNew, $realname, $authority, $user_group);
            }
        }

        function delete($id=''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('UsersModel')->delete($id);
            }
        }

        function groups($id=''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('UsersModel')->getMembersByGroup($id);
            }
        }
    }
?>