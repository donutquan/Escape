<?php
class Objects {
    private $object_id;
    private $object_name;
    private $object_description;
    private $object_room;
    private $progress_value;

    public function __construct($object_id, $object_name, $object_description, $object_room, $progress_value) {
        $this->object_id = $object_id;
        $this->object_name = $object_name;
        $this->object_description = $object_description;
        $this->object_room = $object_room;
        $this->progress_value = $progress_value;
    }

    public function getObjectId() {
        return $this->object_id;
    }

    public function getObjectName() {
        return $this->object_name;
    }

    public function getObjectDescription() {
        return $this->object_description;
    }

    public function getObjectRoom() {
        return $this->object_room;
    }

    public function getProgressValue() {
        return $this->progress_value;
    }
}
?>