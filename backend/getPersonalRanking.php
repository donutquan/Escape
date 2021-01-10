<?php
    require_once 'include/common.php';

    $username = $_POST["username"];

    $roundDAO = new RoundDAO();
    $rankingArray = $roundDAO->getPersonalRanking($username);
    $result = array();
    $attempt = sizeof($rankingArray);

    foreach ($rankingArray as $objects) {
        $result[] = array(
            "attempt" => $attempt--,
            "room_num" => "Room ".$objects->getRoomNum(),
            "duration" => $objects->getDuration(),
            "complete_date" => $objects->getCompleteDate()
        );
    }
    echo json_encode($result);
exit;
?>