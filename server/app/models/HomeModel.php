<?php
    class HomeModel{
        protected $_table = 'users';

        function getList(){
            return [
                'HTML',
                'CSS',
                'JS'
            ];
        }

        function getDetail($id){
            $data =  [
                'PHP',
                'REACTJS',
                'PUGJS'
            ];
            return $data[$id];
        }
    }

?>