<?php
    class Dayoffs extends Controller{
        function __construct(){
            $getAuthHeader = Controller::getAuthorizationHeader();
            $getBearerToken = Controller::getBearerToken($getAuthHeader);
            return $getBearerToken;
        }
        function index(){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                $dataDayoffs = $this->model('DayoffsModel')->getDayoffs();
            }
        }

        function add($user_id='', $date = '', $time_start='', $time_end='', $note='', $day_number='', $status='', $owner=''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('DayoffsModel')->postAdd($user_id, $date, $time_start, $time_end, $note, $day_number, $status, $owner);
            }
        }
        function delete($id=''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('DayoffsModel')->deleteDayoffs($id);
            }
        }
        function update($id=''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('DayoffsModel')->updateDayoffs($id);
            }
        }
        function refuse($id=''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('DayoffsModel')->refuseDayoffs($id);
            }
        }
        function getforuser($id=''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('DayoffsModel')->getDayoffsUser($id);
            }
        }
        function getalluser($id=''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('DayoffsModel')->getDayoffsAllUser($id);
            }
        }
        function updatecomment($id=''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('DayoffsModel')->updateDayoffComment($id);
            }
        }
    }
?>
