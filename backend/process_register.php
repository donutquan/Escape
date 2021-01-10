<?php
require_once 'include/common.php';

if( trim($_POST['username']) != '' && trim($_POST['password']) != "" && trim($_POST['passwordConfirm']) != "") {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $dao = new AccountDAO();
    $usernameExist = $dao->usernameExist($username);
    if ($usernameExist == false) {
        
        $hashed_password = password_hash($password, PASSWORD_DEFAULT);
        $result = array("result" => $dao->register($username, $hashed_password));
    } else {
        $result = array("result" => false, "output" => "Username already exist");
    }
} else {
    $result = array("result" => false, "output" => "Please enter all the inputs");
}
echo json_encode($result);
?>