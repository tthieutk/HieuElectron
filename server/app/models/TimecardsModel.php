<?php
    class TimecardsModel{
        function getTimecardUser($id) {
            global $conn;
            $todayDate = date("d-m-Y");
            $sql = "SELECT td.timecard_open, td.timecard_close, td.id_groupwaretimecard
                FROM timecard_details td
                INNER JOIN timecards tc ON td.id_groupwaretimecard = tc.id
                WHERE tc.user_id = $id AND tc.timecard_date = '$todayDate'";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) >= 0) {
                $row = mysqli_fetch_assoc($result);
                echo json_encode($row);
            } else {
                echo json_encode(['errCode' => 1, "message" => "Không tìm thấy timecards của người dùng"]);
                return;
            }
        }
        function getTimecardToday($id) {
            global $conn;
            $todayDate = date("d-m-Y");
            $sql = "SELECT id, timecard_temp
                FROM timecards
                WHERE user_id = $id AND timecard_date = '$todayDate'";
            $result = mysqli_query($conn, $sql);
            if (mysqli_num_rows($result) >= 0) {
                $row = mysqli_fetch_assoc($result);
                echo json_encode($row);
            } else {
                echo json_encode(['errCode' => 1, "message" => "Không tìm thấy timecards của người dùng"]);
                return;
            }
        }

        function getTimecards($id){
            global $conn;
            $allTimecards = mysqli_query($conn, "SELECT id, timecard_date, timecard_temp FROM timecards  WHERE user_id = $id");
            
            if (mysqli_num_rows($allTimecards) > 0) {
                $json_array["timecarddata"] = array();

                while ($row = mysqli_fetch_assoc($allTimecards)) {
                    $timecardId = $row['id'];
                    $timecardDate = $row['timecard_date'];
                    $timecardTemp = $row['timecard_temp'];

                    $timecardDetailsQuery = "SELECT td.* 
                                            FROM timecard_details td
                                            WHERE td.id_groupwaretimecard = ?";
                    $stmtDetails = mysqli_prepare($conn, $timecardDetailsQuery);

                    if ($stmtDetails) {
                        mysqli_stmt_bind_param($stmtDetails, "i", $timecardId);
                        mysqli_stmt_execute($stmtDetails);
                        $result = mysqli_stmt_get_result($stmtDetails);

                        if (mysqli_num_rows($result) > 0) {
                            // Có thông tin trong bảng timecard_details
                            while ($rowDetails = mysqli_fetch_assoc($result)) {
                                $rowDetails["timecard_date"] = $timecardDate; 
                                $rowDetails["timecard_temp"] = $timecardTemp; 
                                $json_array["timecarddata"][] = $rowDetails;
                            }
                        } else {
                            // Không có thông tin trong bảng timecard_details
                            $row["id"] = intval($row["id"]);
                            $json_array["timecarddata"][] = $row;
                        }
                    }
                }
                echo json_encode($json_array["timecarddata"]);
                return;
            } else {
                echo json_encode(['errCode' => 1, "message" => "Không tìm thấy timecards của người dùng"]);
                return;
            }
        }

        function postAdd($user_id, $timecard_year, $timecard_month, $timecard_day, $timecard_date, $owner, $timecard_temp){
            global $conn;
            $data = json_decode(file_get_contents("php://input"), true);
            $user_id = isset($data['dataTimeCard']['user_id'])?$data['dataTimeCard']['user_id']:'NULL';
            $timecard_year = isset($data['dataTimeCard']['timecard_year'])?$data['dataTimeCard']['timecard_year']:'NULL';
            $timecard_month = isset($data['dataTimeCard']['timecard_month'])?$data['dataTimeCard']['timecard_month']:'NULL';
            $timecard_day = isset($data['dataTimeCard']['timecard_day'])?$data['dataTimeCard']['timecard_day']:'NULL';
            $timecard_date = isset($data['dataTimeCard']['timecard_date'])?$data['dataTimeCard']['timecard_date']:'NULL';
            $owner = isset($data['dataTimeCard']['owner'])?$data['dataTimeCard']['owner']:'NULL';
            $timecard_temp = isset($data['dataTimeCard']['timecard_temp'])?$data['dataTimeCard']['timecard_temp']:'NULL';
            $sql = "INSERT INTO timecards (user_id, timecard_year, timecard_month, timecard_day, timecard_date, owner, timecard_temp, createdAt) 
                                VALUES ($user_id, $timecard_year, $timecard_month, $timecard_day, '$timecard_date', '$owner', '$timecard_temp', NOW())";
            $result = $conn->query($sql);

            header('Content-Type: application/json');
            if($result) {
                $newTimecardId = mysqli_insert_id($conn);
                http_response_code(201);
                echo json_encode(["message" => "Thêm thành công", "id_timecard" => $newTimecardId]);
                return;
            } else {
                echo json_encode(['errCode' => 1, "message" => "Thêm không thành công"]);
                return;
            }
            $conn->close();
        }
        function updateComment($id){
            global $conn;
            $data = json_decode(file_get_contents("php://input"), true);
            $comment = $data['comment'];
            if (isset($id)) {
                $sql = "UPDATE timecards SET timecard_temp = ? WHERE id = ?";
                $stmt = $conn->prepare($sql);
                $stmt->bind_param("si", $comment, $id);
                if ($stmt->execute()) {
                    http_response_code(200);
                    echo json_encode(['errCode' => 0]);
                } else {
                    http_response_code(500);
                    echo json_encode(['errCode' => 1, "error" => $stmt->error]);
                }
                $stmt->close();
            } else {
                http_response_code(400);
                echo json_encode(['errCode' => 1, "message" => "Không thể cập nhật comment"]);
            }
        }
        function deleteTimecards($id){
            global $conn;
            $data = json_decode(file_get_contents("php://input"), true);
            if (isset($id)) {
                $deleteQuery = "DELETE FROM timecards WHERE id = $id";
                if (mysqli_query($conn, $deleteQuery)) {
                    http_response_code(200);
                echo json_encode(['errCode' => 0]);
                } else {
                    http_response_code(500);
                echo json_encode(['errCode' => 1, 'message' => 'không thể Xóa ngày nghỉ']);
                }
            } else {
                http_response_code(400);
                echo json_encode(['errCode' => 2, 'message' => 'không thể tìm thấy ngày nghỉ của người dùng']);
            }
            $conn->close();
        }
    }
?>