<?php
    class AuthorityModel{
        function index(){
            header("Location:" .__WEB_ROOT."/login");
            exit();
        }

        function getList(){
            global $conn;

            // Thực hiện truy vấn SELECT
            $sql = "SELECT * FROM authority";
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