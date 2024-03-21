<?php
	class TimecardsList{
		function getList(){
			global $conn;

            //echo "chạy";

			//Thực hiện truy vấn SELECT
		    $sql = "SELECT users.*, authority.authority_name , groups.group_name FROM users INNER JOIN groups ON users.user_group = groups.id INNER JOIN authority ON users.authority = authority.id";
			$result = $conn->query($sql);

			// Kiểm tra và hiển thị kết quả
			if ($result->num_rows > 0) {
				// Duyệt qua từng dòng dữ liệu
				while ($row = $result->fetch_assoc()) {
					$data[] = $row;
				}
			} else {
				echo "Không có dữ liệu";
			}

			header('Content-Type: application/json');
			echo json_encode($data);
			return;

			// Đóng kết nối
			$conn->close();
		}

		function getTimecardsByGroup($groupid) {
			global $conn;

			//Thực hiện truy vấn SELECT
		    $sql = "SELECT users.*, authority.authority_name , groups.group_name FROM users INNER JOIN groups ON users.user_group = groups.id INNER JOIN authority ON users.authority = authority.id WHERE user_group='$groupid'";
			$result = $conn->query($sql);

			// Kiểm tra và hiển thị kết quả
			if ($result->num_rows > 0) {
				// Duyệt qua từng dòng dữ liệu
				while ($row = $result->fetch_assoc()) {
					$data[] = $row;
				}
			} else {
				echo "Không có dữ liệu";
			}

			header('Content-Type: application/json');
			echo json_encode($data);
			return;

			// Đóng kết nối
			$conn->close();
		}
	}

?>