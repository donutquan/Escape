<?php
    require_once 'include/common.php';
    $roundDAO = new RoundDAO();
    if (isset($_POST['round_id']) && isset($_POST['duration'])) {
        $round_id = $_POST["round_id"];
        $duration = $_POST["duration"];

        $result = array("success" => $roundDAO->updateProgressTime($round_id, $duration));
    } else {
        $result = array("success" => FALSE);
    }

    echo json_encode($result);
?>