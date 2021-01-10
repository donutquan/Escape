<?php
    require_once 'include/common.php';
    $roundDAO = new RoundDAO();
    $username = $_POST["username"];

    $roundArray = $roundDAO->getUserProgress($username);
    
    if ($roundArray) {
        $result = array(
            "round_id" => $roundArray[0]->getRound(),
            "username" => $roundArray[0]->getUsername(),
            "room_num" => $roundArray[0]->getRoomNum(),
            "progress" => $roundArray[0]->getProgress(),
            "duration" => $roundArray[0]->getDuration(),
            "complete_date" => $roundArray[0]->getCompleteDate());
    } else {
        $result = array();
    }
    echo json_encode($result);

 
?>