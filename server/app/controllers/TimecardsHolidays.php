<?php
    class Timecardsholidays extends Controller{
        function __construct(){
            $getAuthHeader = Controller::getAuthorizationHeader();
            $getBearerToken = Controller::getBearerToken($getAuthHeader);
            return $getBearerToken;
        }
        function index(){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('TimecardsHolidaysModel')->getTimecardsHolidays();
            }
        }
        function add($name = '', $days = ''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('TimecardsHolidaysModel')->addTimecardsHolidays($name, $days);
            }
        }
        function update($id = '', $name = '', $days = '') {
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('TimecardsHolidaysModel')->updateTimecardsHolidays($id, $name,$days);
            }
        }
        function delete($id = '') {
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('TimecardsHolidaysModel')->deleteTimecardsHolidays($id);
            }
        }
    }
?>