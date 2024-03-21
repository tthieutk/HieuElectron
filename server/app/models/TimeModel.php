<?php
    class TimeModel{
        function postAdd($user_id, $timecard_year, $timecard_month, $timecard_day, $timecard_date, $owner, $timecard_temp){
            global $conn;
            if ($_SERVER["REQUEST_METHOD"] === "POST") {
				$timePostData = json_decode(file_get_contents("php://input"));

				// Lấy dữ liệu từ phần thân của yêu cầu
                
				// $id = $userPostData->id;
				// $userid = $userPostData->userid;
				// $password = $userPostData->password;
				// $passwordNew = $userPostData->passwordNew;
				// if(!empty($passwordNew)) {
				// 	$passwordNew = password_hash($userPostData->passwordNew, PASSWORD_BCRYPT);
				// }
				// $realname = $userPostData->realname;
				// $authority = $userPostData->authority;
				// $user_group = $userPostData->user_group;
			
				// Cập nhật dữ liệu vào cơ sở dữ liệu
				// if(!empty($passwordNew)) {
				// 	$sql = "UPDATE users SET userid='$userid', password='$passwordNew', password_default='', realname='$realname', authority='$authority', user_group='$user_group', user_groupname='', user_email='', user_skype='', user_ruby='', user_postcode='',user_address='', user_addressruby='', user_phone='', user_mobile='', user_order='', edit_level='', edit_group='', edit_user='', owner='', editor='', createdAt='', updatedAt='' WHERE id='$id'";
				// } else {
				// 	$sql = "UPDATE users SET userid='$userid', password='$password', password_default='', realname='$realname', authority='$authority', user_group='$user_group', user_groupname='', user_email='', user_skype='', user_ruby='', user_postcode='',user_address='', user_addressruby='', user_phone='', user_mobile='', user_order='', edit_level='', edit_group='', edit_user='', owner='', editor='', createdAt='', updatedAt='' WHERE id='$id'";
				// }

				// $result = $conn->query($sql);

				// header('Content-Type: application/json');
				// if($result) {
				// 	echo json_encode(['success' => 'Cập nhật thành viên thành công']);
				// 	return;
				// } else {
				// 	echo json_encode(['success' => 'Please check the Users data!']);
				// 	return;
				// }
			}
        }
    }
?>