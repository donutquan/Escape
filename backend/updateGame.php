<?php
    require_once 'include/common.php';
    $roundDAO = new RoundDAO();
    if (isset($_POST['round_id']) && isset($_POST['outcome'])) {
        $round_id = $_POST["round_id"];
        $outcome = $_POST["outcome"];

        $result = array("success" => $roundDAO->updateGame($round_id, $outcome));
    } else {
        $result = array("success" => FALSE);
    }

    echo json_encode($result);
?>