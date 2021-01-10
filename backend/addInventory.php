<?php
require_once 'include/common.php';
$roundDAO = new RoundDAO();
if (isset($_POST['round_id']) && isset($_POST['object_id']) ) {
    $round_id = $_POST["round_id"];
    $object_id = $_POST["object_id"];

    $result = array("success" => $roundDAO->addInventory($round_id, $object_id));
} else {
    $result = array("success" => FALSE);
}
echo json_encode($result); 
?>