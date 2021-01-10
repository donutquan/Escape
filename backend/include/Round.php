<?php
class Round {
    private $round_id;
    private $username;
    private $room_num;
    private $progress;
    private $duration;
    private $complete_date;

    public function __construct($round_id, $username, $room_num, $progress, $duration, $complete_date) {
        $this->round_id = $round_id;
        $this->username = $username;
        $this->room_num = $room_num;
        $this->progress = $progress;
        $this->duration = $duration;
        $this->complete_date = $complete_date;
    }

    public function getRound() {
        return $this->round_id;
    }

    public function getUsername() {
        return $this->username;
    }

    public function getRoomNum() {
        return $this->room_num;
    }

    public function getProgress() {
        return $this->progress;
    }

    public function getDuration() {
        return $this->duration;
    }
    
    public function getCompleteDate() {
        return $this->complete_date;
    }
}
?>