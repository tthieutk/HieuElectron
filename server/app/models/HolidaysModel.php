<?php
    class HolidaysModel{
        function getHolidays(){
            global $conn;
            $allHolidays = mysqli_query($conn, "SELECT * FROM holidays");
            while($row = mysqli_fetch_array($allHolidays)) {
                $json_array["allHolidays"][] = array("name" => $row['name'], "days" => $row['days']);
            }
            echo json_encode($json_array["allHolidays"]);
            return;
            $conn->close();
        }
    }

?>