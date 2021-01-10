<?php
require_once 'include/common.php';
$roundDAO = new RoundDAO();
if (isset($_POST['username'])) {
    $username = $_POST["username"];
    $result = array("result" => $roundDAO->createRound($username));
} else {
    $result = array("result" => false);
}
echo json_encode($result); 
?>