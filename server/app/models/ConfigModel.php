<?php
    class ConfigModel{
        function getConfig(){
            global $conn;
            $allGroup = mysqli_query($conn, "SELECT * FROM configs");
            while ($row = mysqli_fetch_array($allGroup)) {
                $json_array["configdata"][] = $row;
            }
            echo json_encode($json_array["configdata"]);
            return;
            $conn->close();
        }
    }
?>