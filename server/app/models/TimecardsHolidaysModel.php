<?php
    class TimecardsHolidaysModel{
        function getTimecardsHolidays(){
            global $conn;
            $allTimecardsHolidays = mysqli_query($conn, "SELECT * FROM holidays");
            if(mysqli_num_rows($allTimecardsHolidays) > 0) {
                while($row = mysqli_fetch_array($allTimecardsHolidays)) {
                    $json_array["holidaydata"][] = array("id" => $row['id'], "name" => $row['name'], "days" => $row['days']);
                }
                echo json_encode($json_array["holidaydata"]);
                return;
            } else {
                echo json_encode(["result" => "Please check the Data"]);
                return;
            }
            $conn->close();
        }
        function addTimecardsHolidays($name , $days){
            global $conn;
            if ($_SERVER["REQUEST_METHOD"] === "POST") {
                $timecardsHolidaysPostData = json_decode(file_get_contents("php://input"));
                $name = $timecardsHolidaysPostData->name;
                $days = $timecardsHolidaysPostData->days;
                $insertQuery = "INSERT INTO holidays (name, days) VALUES (?, ?)";
                $stmt = mysqli_prepare($conn, $insertQuery);

                if (!$stmt) {
                    http_response_code(500);
                    echo json_encode(["error" => "Lỗi khi chuẩn bị câu lệnh: " . mysqli_error($conn)]);
                    exit();
                }
                mysqli_stmt_bind_param($stmt, "ss", $name, $days);

                if (mysqli_stmt_execute($stmt)) {
                    http_response_code(201);
                    echo json_encode(["message" => "Thêm thành công"]);
                } else {
                    http_response_code(500);
                    echo json_encode(["error" => "Thêm không thành công: " . mysqli_error($conn)]);
                }

                mysqli_stmt_close($stmt);
            }
        }
        function updateTimecardsHolidays($id, $name, $days){
            global $conn;
            if ($_SERVER["REQUEST_METHOD"] === "PUT") {
                $timecardsHolidaysUpdateData = json_decode(file_get_contents("php://input"), true);
                if (isset($timecardsHolidaysUpdateData['id'], $timecardsHolidaysUpdateData['name'], $timecardsHolidaysUpdateData['days'])) {
                    $id = mysqli_real_escape_string($conn, $timecardsHolidaysUpdateData['id']);
                    $name = mysqli_real_escape_string($conn, $timecardsHolidaysUpdateData['name']);
                    $days = mysqli_real_escape_string($conn, $timecardsHolidaysUpdateData['days']);
                    $updateQuery = "UPDATE holidays SET name = '$name', days = '$days' WHERE id = '$id'"; 
                    if (mysqli_query($conn, $updateQuery)) {
                        http_response_code(200);
                        echo json_encode(["message" => "Dữ liệu được cập nhật thành công"]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["error" => "Không thể cập nhật dữ liệu"]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "Dữ liệu không hợp lệ"]);
                }
                $conn->close();
            }
        }
        function deleteTimecardsHolidays($id){
            global $conn;
            if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
                $timecardsHolidaysDeleteData = json_decode(file_get_contents("php://input"), true);
                if (isset($timecardsHolidaysDeleteData['id'])) {
                    $id = mysqli_real_escape_string($conn, $timecardsHolidaysDeleteData['id']);
                    $deleteQuery = "DELETE FROM holidays WHERE id = $id";
                    if (mysqli_query($conn, $deleteQuery)) {
                        http_response_code(200);
                        echo json_encode(["message" => "Data deleted successfully"]);
                    } else {
                        http_response_code(500);
                        echo json_encode(["error" => "Failed to delete data"]);
                    }
                } else {
                    http_response_code(400);
                    echo json_encode(["error" => "Invalid data"]);
                }
                $conn->close();
            }
        }
    }
?>