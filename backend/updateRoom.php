<?php
    require_once 'include/common.php';
    $roundDAO = new RoundDAO();
    if (isset($_POST['round_id']) && isset($_POST['room_num'])) {
        $round_id = $_POST["round_id"];
        $room_num = $_POST["room_num"];

        $result = array("success" => $roundDAO->updateProgressRoom($round_id, $room_num));
    } else {
        $result = array("success" => FALSE);
    }
    echo json_encode($result); 
?>