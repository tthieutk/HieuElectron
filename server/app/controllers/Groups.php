<?php
    class Groups extends Controller{
        function __construct(){
            $getAuthHeader = Controller::getAuthorizationHeader();
            $getBearerToken = Controller::getBearerToken($getAuthHeader);
            return $getBearerToken;
        }
        function index(){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('GroupsModel')->getGroups();
            }
        }
        function add($group_name = '', $add_level = '', $owner = ''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('GroupsModel')->addGroups($group_name, $add_level, $owner, date('Y-m-d H:i:s'));
            }
        }
        function update($id = '', $group_name = '') {
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('GroupsModel')->updateGroups($id, $group_name);
            }
        }
        function delete($id=''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('GroupsModel')->deleteGroups($id);
            }
        }
    }  
?>