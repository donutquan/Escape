<?php
    require_once 'include/common.php';
    $roundDAO = new RoundDAO();
    $round_id = $_POST["round_id"];
    $object_room = $_POST['object_room'];

    // $round_id = 6;
    // $object_room = 1;
    

    echo json_encode($roundDAO->getRoomProgress($round_id, $object_room));
?>