<?php
    class ObjectsDAO {
        public function getObjects($object_room) {
            $conn = new ConnectionManager();
            $pdo = $conn->getConnection();
            
            $sql = "SELECT * FROM objects WHERE object_room = :object_room";

            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':object_room', $object_room, PDO::PARAM_INT);
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $stmt->execute();
            
            $result = [];

            while($row = $stmt->fetch()){
                $result[] = new Objects(
                    $row["object_id"],
                    $row["object_name"],
                    $row["object_description"],
                    $row["object_room"],
                    $row["progress_value"]);
            }
            $stmt = null;
            $pdo = null;
            return $result;
        }

        public function getUserObjects($object_room, $round_id) {
            $conn = new ConnectionManager();
            $pdo = $conn->getConnection();
            
            $sql = "SELECT ro.object_id, o.object_name, o.object_description, o.object_room, o.progress_value
                    FROM round_objects ro, objects o
                    WHERE ro.object_id = o.object_id
                    AND ro.round_id = :round_id
                    AND object_room = :object_room";

            $stmt = $pdo->prepare($sql);
            $stmt->bindParam(':object_room', $object_room, PDO::PARAM_INT);
            $stmt->bindParam(':round_id', $round_id, PDO::PARAM_INT);
            $stmt->setFetchMode(PDO::FETCH_ASSOC);
            $stmt->execute();
            
            $result = [];

            while($row = $stmt->fetch()){
                $result[] = new Objects(
                    $row["object_id"],
                    $row["object_name"],
                    $row["object_description"],
                    $row["object_room"],
                    $row["progress_value"]);
            }
            $stmt = null;
            $pdo = null;
            return $result;
        }
    }
?>