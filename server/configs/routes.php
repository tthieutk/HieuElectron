<?php
    $routes['default_controller'] = 'home';
    /* 
    Đường dẫn ảo => Đường dẫn thật
    */
    // Login
    $routes['login'] = 'login';

    // Group
    $routes['groups'] = 'groups';
    $routes['groups/add'] = 'groups/add';
    $routes['groups/update'] = 'groups/update';
    $routes['groups/delete'] = 'groups/delete';

    // Users
    $routes['users'] = 'users';
    $routes['users/detail/.+-(\d+)'] = 'users/detail/$1';
    $routes['users/add'] = 'users/add';
    $routes['users/edit/.+-(\d+)'] = 'users/edit/$1';
    $routes['users/update'] = 'users/update';
    $routes['users/delete'] = 'users/delete';
    $routes['users/groups/.+-(\d+)'] = 'users/groups/$1';

    // Authority
    $routes['authority'] = 'authority';
    
    // dayoffs
    $routes['dayoffs'] = 'dayoffs';
    $routes['dayoffs/add'] = 'dayoffs/add';
    $routes['dayoffs/update/.+-(\d+)'] = 'dayoffs/update/$1';
    $routes['dayoffs/refuse/.+-(\d+)'] = 'dayoffs/refuse/$1';
    $routes['dayoffs/delete/.+-(\d+)'] = 'dayoffs/delete/$1';
    $routes['dayoffs/getforuser/.+-(\d+)'] = 'dayoffs/getforuser/$1';
    $routes['dayoffs/getalluser/.+-(\d+)'] = 'dayoffs/getalluser/$1';

    // timecards
    $routes['timecards/load/.+-(\d+)'] = 'timecards/load/$1';
    $routes['timecards/loaduser/.+-(\d+)'] = 'timecards/loaduser/$1';
    $routes['timecards/getall/.+-(\d+)'] = 'timecards/getall/$1';
    $routes['timecards/add'] = 'timecards/add';
    $routes['timecards/updatecomment/.+-(\d+)'] = 'timecards/updatecomment/$1';
    $routes['timecards/delete/.+-(\d+)'] = 'timecards/delete/$1';


    //timecardSetting
    $routes['timecards/setting'] = 'timecards/setting';
    $routes['timecards/getInput'] = 'timecards/getInput';
    
    // timecardslist
    $routes['timecards/list'] = 'timecards/list';

    $routes['timecarddetails/add'] = 'timecarddetails/add';
    $routes['timecarddetails/addnew'] = 'timecarddetails/addnew';
    $routes['timecarddetails/update'] = 'timecarddetails/update';
    $routes['timecarddetails/updateall'] = 'timecarddetails/updateall';
    $routes['timecarddetails/updatecomment'] = 'timecarddetails/updatecomment';

    // holidays
    $routes['holidays'] = 'holidays';

    // config
    $routes['config'] = 'config';

    // timecardsHolidays
    $routes['timecardsholidays'] = 'timecardsholidays';
    $routes['timecardsholidays/add'] = 'timecardsholidays/add';
    $routes['timecardsholidays/update'] = 'timecardsholidays/update';
    $routes['timecardsholidays/delete'] = 'timecardsholidays/delete';


    // application
    $routes['application'] = 'application';
?>