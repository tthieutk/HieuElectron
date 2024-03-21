<?php
    class TimecardDetailsModel{
        function postAdd(){
            global $conn;
            $data = json_decode(file_get_contents("php://input"), true);
            $id_groupwaretimecard = isset($data['dataTimeCardDetails']['id_groupwaretimecard'])?$data['dataTimeCardDetails']['id_groupwaretimecard']:'null';
            $timecard_open = isset($data['dataTimeCardDetails']['timecard_open'])?$data['dataTimeCardDetails']['timecard_open']:'null';
            $timecard_timeinterval = isset($data['dataTimeCardDetails']['timecard_timeinterval'])?$data['dataTimeCardDetails']['timecard_timeinterval']:'null';
            $timecard_comment = isset($data['dataTimeCardDetails']['timecard_comment'])?$data['dataTimeCardDetails']['timecard_comment']:'null';

            $sql = "INSERT INTO timecard_details(id_groupwaretimecard, timecard_open, timecard_originalopen, timecard_timeinterval, timecard_comment, createdAt, updatedAt) VALUES ($id_groupwaretimecard, '$timecard_open', '$timecard_open', '$timecard_timeinterval', '$timecard_comment', NOW(), NOW())";
            $result = $conn->query($sql);

            header('Content-Type: application/json');
            if($result) {
                echo json_encode(['message' => 'Thêm ngày nghỉ mới thành công']);
                return;
            } else {
                echo json_encode(['errCode' => 1, "message" => "Không thể thêm mới timecardDetails của người dùng"]);
                return;
            }
            $conn->close();
        }
        function postAddNew(){
            global $conn;
            $data = json_decode(file_get_contents("php://input"), true);
            $id_groupwaretimecard = isset($data['dataTimeCardDetails']['id_groupwaretimecard'])?$data['dataTimeCardDetails']['id_groupwaretimecard']:'null';
            $timecard_open = isset($data['dataTimeCardDetails']['timecard_open'])?$data['dataTimeCardDetails']['timecard_open']:'null';
            $timecard_close = isset($data['dataTimeCardDetails']['timecard_close'])?$data['dataTimeCardDetails']['timecard_close']:'null';
            $timecard_time = isset($data['dataTimeCardDetails']['timecard_time'])?$data['dataTimeCardDetails']['timecard_time']:'null';
            $timecard_timeover = isset($data['dataTimeCardDetails']['timecard_timeover'])?$data['dataTimeCardDetails']['timecard_timeover']:'null';
            $timecard_timeinterval = isset($data['dataTimeCardDetails']['timecard_timeinterval'])?$data['dataTimeCardDetails']['timecard_timeinterval']:'null';
            $timecard_comment = isset($data['dataTimeCardDetails']['timecard_comment'])?$data['dataTimeCardDetails']['timecard_comment']:'null';
            $editor = isset($data['dataTimeCardDetails']['editor'])?$data['dataTimeCardDetails']['editor']:'null';

            $sql = "INSERT INTO timecard_details(id_groupwaretimecard, timecard_open, timecard_close, timecard_time, timecard_timeover, timecard_timeinterval, timecard_comment, editor, createdAt, updatedAt) VALUES ($id_groupwaretimecard, '$timecard_open', '$timecard_close', '$timecard_time', '$timecard_timeover', '$timecard_timeinterval', '$timecard_comment', '$editor', NOW(), NOW())";
            $result = $conn->query($sql);

            header('Content-Type: application/json');
            if($result) {
                echo json_encode(['success' => 'Thêm ngày nghỉ mới thành công']);
                return;
            } else {
                echo json_encode(['errCode' => 1, "message" => "Không thể thêm mới timecards"]);
                return;
            }
            $conn->close();
        }
		function postUpdate($timecard_now, $timecard_originalclose, $timecard_interval, $overtime, $timecardId){
			global $conn;
            $data = json_decode(file_get_contents("php://input"), true);
            $timecardId = isset($data["dataTime"]["id"]) ? $data["dataTime"]["id"] : 'null';
            $timecard_open = isset($data["dataTime"]["timecard_open"]) ? $data["dataTime"]["timecard_open"] : 'null';
            $timecard_now = isset($data["dataTime"]["timecard_now"]) ? $data["dataTime"]["timecard_now"] : 'null';
            $timecard_time = isset($data["dataTime"]["timecard_time"]) ? $data["dataTime"]["timecard_time"] : 'null';
            $timecard_timeover = isset($data["dataTime"]["timecard_timeover"]) ? $data["dataTime"]["timecard_timeover"] : 'null';
            $timecard_timeinterval = isset($data["dataTime"]["timecard_timeinterval"]) ? $data["dataTime"]["timecard_timeinterval"] : 'null';
            
            
            $sql = "UPDATE timecard_details SET timecard_close = ?, timecard_originalclose = ?, timecard_time= ?, timecard_timeover = ?, timecard_timeinterval = ? WHERE id_groupwaretimecard = ?";
            $stmt = $conn->prepare($sql);
            $stmt->bind_param("sssssi", $timecard_now, $timecard_now, $timecard_time, $timecard_timeover, $timecard_timeinterval, $timecardId);

            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(["success" => true]);
            } else {
                http_response_code(500);
                echo json_encode(['errCode' => 1, "error" => $stmt->error]);
            }

            $stmt->close();
        }
        function updateComment($comment,$id){
            global $conn;
            $data = json_decode(file_get_contents("php://input"), true);
            $id = isset($data["id"]) ? $data["id"] : 'null';
            $comment = isset($data["comment"]) ? $data["comment"] : 'null';
            $sql = "UPDATE timecard_details SET timecard_comment = ? WHERE id_groupwaretimecard = ?";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $conn->error);
            }
            $stmt->bind_param("si", $comment, $id);
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(["success" => true]);
            } else {
                throw new Exception("Execute failed: " . $stmt->error);
            }

            $stmt->close();
        }
        function updateAll(){
			global $conn;
            $data = json_decode(file_get_contents("php://input"), true);
            $id = $data['id'];
            $timecard_open = $data['timecard_open'];
            $timecard_close = $data['timecard_close'];
            $timecard_time = $data['timecard_time'];
            $timecard_timeover = $data['timecard_timeover'];
            $timecard_comment = $data['timecard_comment'];
            $editor = $data['editor'];
            $timecard_timeinterval = isset($data["timecard_timeinterval"]) ? $data["timecard_timeinterval"] : 'null';

            $sql = "UPDATE timecard_details SET timecard_open = ?, timecard_close = ?, timecard_time = ?, timecard_timeover = ?, timecard_comment = ?, editor= ?, timecard_timeinterval = ?, updatedAt = NOW()  WHERE id_groupwaretimecard = $id";
            $stmt = $conn->prepare($sql);
            if (!$stmt) {
                throw new Exception("Prepare failed: " . $conn->error);
            }
            $stmt->bind_param("sssssss", $timecard_open, $timecard_close, $timecard_time, $timecard_timeover ,$timecard_comment, $editor, $timecard_timeinterval);
            if ($stmt->execute()) {
                http_response_code(200);
                echo json_encode(["success" => true]);
            } else {
                throw new Exception("Execute failed: " . $stmt->error);
            }

            $stmt->close();
        }
    }
?>