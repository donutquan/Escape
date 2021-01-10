<?php
require_once 'include/common.php';

if( trim($_POST['username']) != '' && trim($_POST['password']) != '' ) {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $dao = new AccountDAO();
    $hashed_password = $dao->getHashedPassword($username);

    if ($hashed_password != null) {
        if (password_verify($password, $hashed_password)) {
            $result = array("result" => true, "output" => $username);
        }
        else {
            $result = array("result" => false, "output" => "You have entered a wrong password");
        }
    }
    else {
        $result = array("result" => false, "output" => "You have entered a wrong username");
    }
}
else {
    $result = array("result" => false, "output" => "Please provide both username and password");
}
echo json_encode($result);
?>
