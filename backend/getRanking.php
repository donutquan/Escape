<?php
    require_once 'include/common.php';
    $roundDAO = new RoundDAO();
    $rankingArray = $roundDAO->getRanking();
    $result = array();
    $rank = 1;
    foreach ($rankingArray as $objects) {
        $result[] = array(
            "rank" => $rank++,
            "username" => $objects->getUsername(),
            "duration" => $objects->getDuration(),
            "complete_date" => $objects->getCompleteDate()
        );
    }
    echo json_encode($result);
exit;
?>