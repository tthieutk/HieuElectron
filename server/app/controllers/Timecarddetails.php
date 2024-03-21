<?php
    class TimecardDetails extends Controller{
        function __construct(){
            $getAuthHeader = Controller::getAuthorizationHeader();
            $getBearerToken = Controller::getBearerToken($getAuthHeader);
            return $getBearerToken;
        }
        function add(){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('TimecardDetailsModel')->postAdd();
            }
        }
        function addnew(){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('TimecardDetailsModel')->postAddNew();
            }
        }
        function update($timecard_now='', $timecard_originalclose='', $timecard_interval='', $overtime='', $timecardId=''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('TimecardDetailsModel')->postUpdate($timecard_now, $timecard_originalclose, $timecard_interval, $overtime, $timecardId);
            }
        }
        function updatecomment($comment = '',$id = ''){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('TimecardDetailsModel')->updateComment($comment,$id);
            }
        }
        function updateall(){
            $is_jwt_valid = Controller::is_jwt_valid($this->__construct());
            if($is_jwt_valid == 1){
                return $this->model('TimecardDetailsModel')->updateAll();
            }
        }
    }
?>