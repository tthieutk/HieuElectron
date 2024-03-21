<?php
    class GroupsModel{
        function getGroups(){
            global $conn;
            $allGroup = mysqli_query($conn, "SELECT * FROM groups");
            if(mysqli_num_rows($allGroup) > 0) {
                while($row = mysqli_fetch_array($allGroup)) {
                    $json_array["groupdata"][] = array("id" => $row['id'], "group_name" => $row['group_name']);
                }
                echo json_encode($json_array["groupdata"]);
                return;
            } else {
                echo json_encode(["result" => "Please check the Data"]);
                return;
            }
            $conn->close();
        }
        function addGroups($group_name, $add_level, $owner, $createdAt)
        {
            global $conn;
            if ($_SERVER["REQUEST_METHOD"] === "POST") {
                $groupPostData = json_decode(file_get_contents("php://input"));
                $group_name = $groupPostData->group_name;
                $add_level = $groupPostData->add_level;
                $owner     = $groupPostData->owner;
                $createdAt = date('Y-m-d H:i:s');
                $insertQuery = "INSERT INTO groups (group_name, add_level, owner, createdAt) 
                    VALUES (?, ?, ?, ?)";
                $stmt = mysqli_prepare($conn, $insertQuery);

                if (!$stmt) {
                    http_response_code(500);
                    echo json_encode(["error" => "Lỗi khi chuẩn bị câu lệnh: " . mysqli_error($conn)]);
                    exit();
                }
                mysqli_stmt_bind_param($stmt, "siss", $group_name, $add_level, $owner, $createdAt);

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
        function updateGroups($id, $group_name){
            global $conn;
            if ($_SERVER["REQUEST_METHOD"] === "PUT") {
                $groupUpdateData = json_decode(file_get_contents("php://input"), true);
                if (isset($groupUpdateData['id'], $groupUpdateData['group_name'])) {
                    $id = mysqli_real_escape_string($conn, $groupUpdateData['id']);
                    $group_name = mysqli_real_escape_string($conn, $groupUpdateData['group_name']);
                    $updateQuery = "UPDATE groups SET group_name = '$group_name' WHERE id = '$id'"; 
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
        function deleteGroups(){
            global $conn;
            if ($_SERVER["REQUEST_METHOD"] === "DELETE") {
                $groupDeleteData = json_decode(file_get_contents("php://input"), true);
                if (isset($groupDeleteData['id'])) {
                    $id = mysqli_real_escape_string($conn, $groupDeleteData['id']);
                    $deleteQuery = "DELETE FROM groups WHERE id = $id";
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