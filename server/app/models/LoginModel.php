<?php
	class LoginModel{
		function Login($userid, $password){
			global $conn;

            function base64url_encode($str){
				return rtrim(strtr(base64_encode($str), '+/', '-_'), '=');
			}
			
			function generate_jwt($header, $payload, $secret = 'Caily-Group@;+/*95'){
				$header_encode = base64url_encode(json_encode($header));
				$payload_encode = base64url_encode(json_encode($payload));

				$signature = hash_hmac('SHA256',  $header_encode . '.' . $payload_encode, $secret, true);
				$signature_encode = base64url_encode($signature);

				$jwt = $header_encode . '.' . $payload_encode .'.' . $signature_encode;
				return $jwt;
			}
			
			if ($_SERVER["REQUEST_METHOD"] === "POST") {
				$userPostData = json_decode(file_get_contents("php://input"));

				// Lấy dữ liệu từ phần thân của yêu cầu
				$userid = $userPostData->userid;
				$password = $userPostData->password;
			
                $sql = "SELECT users.*, groups.group_name, authority.authority_name FROM users 
                JOIN groups ON users.user_group = groups.id
                JOIN authority ON users.authority = authority.id
                WHERE userid='$userid'";

                $result = $conn->query($sql);
                if ($result->num_rows > 0) {
                    // Duyệt qua từng dòng dữ liệu
                    while ($row = $result->fetch_assoc()) {
                        $data = $row;
                    }

                    if(password_verify($password, $data['password'])) {
                        $header = [
                            'alg' => 'HS256',
                            'typ' => 'JWT'
                        ];

                        $date = new DateTime();
                        $timestamp = $date->getTimestamp();
        
                        $payload = [
                            'id' => $data['id'],
                            'userid' => $data['userid'],
                            'realname' => $data['realname'],
                            'roles' => $data['authority_name'],
                            'user_group' => $data['group_name'],
                            'user_group_id' => $data['user_group'],
                            'iat'=> $timestamp,
                            'exp'=>$timestamp+10
                        ];
        
                        $jwt = generate_jwt($header, $payload);
                        $data['token'] = $jwt;
                        unset($data['password']);
                        $result = "ok";
                    } else {
                        $result = "error";
                        $data = [];
                    }
                } else {
                    $result = "error";
                    $data = [];
                }
                
				header('Content-Type: application/json');
				echo json_encode(
                    ['success' => $result, 'info' => $data]
                );
				return;
			}
		}
	}

?>