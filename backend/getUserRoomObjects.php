<?php
    require_once 'include/common.php';
    $objectsDAO = new ObjectsDAO();
    $object_room = $_POST["object_room"];
    $round_id = $_POST["round_id"];

    $objectsArray = $objectsDAO->getUserObjects($object_room, $round_id);
    
    $result = array("room_objects" => array() );

    foreach ($objectsArray as $objects) {
        $result["room_objects"][] = array(
            "object_id" => $objects->getObjectId(),
            "object_name" => $objects->getObjectName(),
            "object_description" => $objects->getObjectDescription(),
            "object_room" => $objects->getObjectRoom(),
            "progress_value" => $objects->getProgressValue()
        );
    }

    echo json_encode($result);

 
?>