<?php
class RoundDAO {
    public function createRound($username) {
        $conn = new ConnectionManager();
        $pdo = $conn->getConnection();

        $sql = "INSERT INTO `round` (`username`, `room_num`, `duration`) VALUES (:username, 1, '00:00:00.000000')";

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);

        $isOk = $stmt->execute();
        // $lastID = $pdo->lastInsertId();
        $stmt = null;
        $pdo = null;
        return $isOk;  
    }

    public function getUserProgress($username) {
        $conn = new ConnectionManager();
        $pdo = $conn->getConnection();
        
        $sql = "SELECT * FROM round
                WHERE username = :username
                AND complete_date IS NULL
                AND duration != '01:00:00'";

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();
        
        $result = [];
        while($row = $stmt->fetch()){
            $result[] = new Round(
                $row["round_id"],
                $row["username"],
                $row["room_num"],
                null,
                $row["duration"],
                $row["complete_date"]);
        }
        $stmt = null;
        $pdo = null;
        return $result;
    }

    public function getRoomProgress($round_id, $object_room) {
        $conn = new ConnectionManager();
        $pdo = $conn->getConnection();
        
        $sql = "SELECT SUM(o.progress_value) AS 'progress'
                FROM round_objects ro, objects o
                WHERE ro.object_id = o.object_id
                AND round_id = :round_id
                AND object_room = :object_room
                GROUP BY ro.round_id;";

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':round_id', $round_id, PDO::PARAM_INT);
        $stmt->bindParam(':object_room', $object_room, PDO::PARAM_INT);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();
        
        $row = $stmt->fetch();
        $result = $row;
        
        $stmt = null;
        $pdo = null;
        return $result;
    }

    
    public function updateProgressTime($round_id, $duration) {
        $conn = new ConnectionManager();
        $pdo = $conn->getConnection();

        $sql = "UPDATE round 
                SET duration = :duration
                WHERE round_id = :round_id";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':round_id', $round_id, PDO::PARAM_INT);
        $stmt->bindParam(':duration', $duration, PDO::PARAM_STR);
        $isOk = $stmt->execute();
        $stmt = null;
        $pdo = null;
        return $isOk;
    }

    public function updateProgressRoom($round_id, $room_num) {
        $conn = new ConnectionManager();
        $pdo = $conn->getConnection();

        $sql = "UPDATE round 
                SET room_num = :room_num
                WHERE round_id = :round_id";

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':round_id', $round_id, PDO::PARAM_INT);
        $stmt->bindParam(':room_num', $room_num, PDO::PARAM_INT);
        $isOk = $stmt->execute();
        $stmt = null;
        $pdo = null;
        return $isOk;
    }

    public function addInventory($round_id, $object_id) {
        $conn = new ConnectionManager();
        $pdo = $conn->getConnection();
        
        $sql = "INSERT INTO round_objects (round_id, object_id) VALUES (:round_id, :object_id)";
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':round_id', $round_id, PDO::PARAM_INT);
        $stmt->bindParam(':object_id', $object_id, PDO::PARAM_INT);
        $isOk = $stmt->execute();
        $stmt = null;
        $pdo = null;
        return $isOk;
    }

    public function updateGame($round_id, $outcome) {
        $conn = new ConnectionManager();
        $pdo = $conn->getConnection();

        if ($outcome == "win") {
            $sql = "UPDATE round 
                    SET complete_date = NOW()
                    WHERE round_id = :round_id";
        } else {
            $sql = "UPDATE round 
                    SET duration = '01:00:00'
                    WHERE round_id = :round_id";
        }
        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':round_id', $round_id, PDO::PARAM_INT);
        $isOk = $stmt->execute();
        $stmt = null;
        $pdo = null;
        return $isOk;
    }

    public function getRanking() {
        $conn = new ConnectionManager();
        $pdo = $conn->getConnection();
        
        $sql = "SELECT username, MIN(duration) AS 'duration', complete_date 
                FROM round 
                WHERE complete_date IS NOT NULL
                GROUP BY username
                ORDER BY duration;";

        $stmt = $pdo->prepare($sql);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();
        
        $result = [];
        while($row = $stmt->fetch()){
            $result[] = new Round(
                null,
                $row["username"],
                null,
                null,
                $row["duration"],
                $row["complete_date"]);
        }
        $stmt = null;
        $pdo = null;
        return $result;
    }


    public function getPersonalRanking($username) {
        $conn = new ConnectionManager();
        $pdo = $conn->getConnection();
        
        $sql = "SELECT room_num, duration, complete_date
                FROM round 
                WHERE username = :username
                ORDER BY round_id DESC;";

        $stmt = $pdo->prepare($sql);
        $stmt->bindParam(':username', $username, PDO::PARAM_STR);
        $stmt->setFetchMode(PDO::FETCH_ASSOC);
        $stmt->execute();
        
        $result = [];
        while($row = $stmt->fetch()){
            $result[] = new Round(
                null,
                null,
                $row["room_num"],
                null,
                $row["duration"],
                $row["complete_date"]);
        }
        $stmt = null;
        $pdo = null;
        return $result;
    }
}
?>