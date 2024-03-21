<?php
   class TimecardSetting{
        function getList(){
            global $conn;

            // Thực hiện truy vấn SELECT
            $sql = "SELECT config_key, config_value FROM configs WHERE config_key IN ('opentime', 'closetime', 'openlunch', 'closelunch')";
            $result = $conn->query($sql);

            // Kiểm tra và hiển thị kết quả
            if ($result->num_rows > 0) {
                // Duyệt qua từng dòng dữ liệu
                while ($row = $result->fetch_assoc()) {
                    $data[] = $row;
                }
            } else {
                $data = [];  // Trả về mảng rỗng nếu không có dữ liệu
            }

            header('Content-Type: application/json');
            echo json_encode($data);
            return;
        }

        function getInput($data) {
            global $conn;

            $timeSettingPostData = json_decode(file_get_contents("php://input"));

            // Lấy giá trị configKey và hoursMinutes từ dữ liệu gửi từ frontend
            $configKey = $timeSettingPostData[0]->config_key; // Chỉnh sửa thành config_key
            $hoursMinutes = $timeSettingPostData[0]->hoursMinutes;

            // Tách giờ và phút từ chuỗi hoursMinutes
            list($hours, $minutes) = explode(':', $hoursMinutes);

            // Cập nhật giá trị config_value trong cơ sở dữ liệu
            $stmt = $conn->prepare("UPDATE configs SET config_value = ? WHERE config_key = ?");
            $stmt->bind_param("ss", $hoursMinutes, $configKey);

            if ($stmt->execute()) {
                    switch ($configKey) {
                        case "opentime": 
                            http_response_code(200);
                            break;
                        case "closetime": 
                            http_response_code(200);
                            break;
                        case "openlunch":
                            http_response_code(200);
                            break;
                        case "closelunch": 
                            http_response_code(200);
                            break;
                        }
               
                     echo json_encode(['message' => http_response_code(200)]); // Xuất thông điệp thành công
            } else {
                $errorMessage = http_response_code(400);
                echo json_encode(['error' => $errorMessage]); // Xuất thông điệp lỗi
            }

            $stmt->close();

        }
    }
?>