-- MySQL Script generated by MySQL Workbench
-- 11/14/20 14:38:27
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='TRADITIONAL,ALLOW_INVALID_DATES';

-- -----------------------------------------------------
-- Schema escape
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `escape` ;

-- -----------------------------------------------------
-- Schema escape
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `escape` DEFAULT CHARACTER SET utf8 COLLATE utf8_general_ci ;
USE `escape` ;

-- -----------------------------------------------------
-- Table `escape`.`account`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `escape`.`account` ;

CREATE TABLE IF NOT EXISTS `escape`.`account` (
  `username` VARCHAR(20) NOT NULL,
  `hashed_password` VARCHAR(256) NOT NULL,
  PRIMARY KEY (`username`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `escape`.`round`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `escape`.`round` ;

CREATE TABLE IF NOT EXISTS `escape`.`round` (
  `round_id` INT NOT NULL AUTO_INCREMENT,
  `username` VARCHAR(20) NOT NULL,
  `room_num` INT NOT NULL,
  `duration` TIME(6) NOT NULL,
  `complete_date` DATETIME NULL,
  PRIMARY KEY (`round_id`, `username`),
  INDEX `fk_user_has_game_user_idx` (`username` ASC),
  CONSTRAINT `fk_user_has_game_user`
    FOREIGN KEY (`username`)
    REFERENCES `escape`.`account` (`username`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `escape`.`objects`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `escape`.`objects` ;

CREATE TABLE IF NOT EXISTS `escape`.`objects` (
  `object_id` INT NOT NULL AUTO_INCREMENT,
  `object_name` VARCHAR(50) NOT NULL,
  `object_description` VARCHAR(45) NOT NULL,
  `object_room` INT NOT NULL,
  `progress_value` INT NOT NULL,
  PRIMARY KEY (`object_id`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `escape`.`round_objects`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `escape`.`round_objects` ;

CREATE TABLE IF NOT EXISTS `escape`.`round_objects` (
  `round_id` INT NOT NULL,
  `object_id` INT NOT NULL,
  PRIMARY KEY (`round_id`, `object_id`),
  INDEX `fk_round_has_objects_objects1_idx` (`object_id` ASC),
  INDEX `fk_round_has_objects_round1_idx` (`round_id` ASC),
  CONSTRAINT `fk_round_has_objects_round1`
    FOREIGN KEY (`round_id`)
    REFERENCES `escape`.`round` (`round_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_round_has_objects_objects1`
    FOREIGN KEY (`object_id`)
    REFERENCES `escape`.`objects` (`object_id`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;

-- -----------------------------------------------------
-- Data for table `escape`.`account`
-- -----------------------------------------------------
START TRANSACTION;
USE `escape`;
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('user1', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('user2', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('user3', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('user4', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('user5', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('yuquanyeo', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('davidlyj', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('todocraig.shoto', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('joelytj_', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('cposkitt', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('hongsengong', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('tanahkow', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('escaper', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('lorem_ipsum', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('prataboy', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('chickenrice', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('burgerfries', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('hokkienmee', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('tomdickharry', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');
INSERT INTO `escape`.`account` (`username`, `hashed_password`) VALUES ('leehsienloong', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');

COMMIT;


-- -----------------------------------------------------
-- Data for table `escape`.`round`
-- -----------------------------------------------------
START TRANSACTION;
USE `escape`;
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (1, 'user1', 3, '00:58:31', '2020-11-08 20:00:00');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (2, 'user2', 2, '00:36:30', NULL);
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (3, 'user3', 3, '00:48:39', NULL);
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (4, 'user4', 3, '00:58:39', '2020-11-08 10:00:00');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (5, 'user1', 1, '00:00:01', NULL);
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (6, 'yuquanyeo', 3, '00:45:45', '2020-11-14 10:10:32');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (7, 'davidlyj', 3, '00:46:39', '2020-11-13 11:30:45');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (8, 'todocraig.shoto', 3, '00:53:23', '2020-11-12 08:11:01');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (9, 'joelytj_', 3, '00:53:55', '2020-11-11 12:16:05');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (10, 'cposkitt', 3, '00:42:35', '2020-11-14 10:38:08');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (11, 'hongsengong', 3, '00:43:55', '2020-11-14 16:13:00');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (12, 'tanahkow', 3, '00:56:54', '2020-11-13 18:57:02');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (13, 'escaper', 3, '00:35:30', '2020-11-12 16:10:30');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (14, 'lorem_ipsum', 3, '00:58:12', '2020-11-14 20:46:21');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (15, 'prataboy', 3, '00:49:48', '2020-11-11 18:10:30');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (16, 'chickenrice', 3, '00:59:50', '2020-11-11 18:10:30');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (17, 'burgerfries', 3, '00:51:52', '2020-11-14 10:05:10');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (18, 'hokkienmee', 3, '00:56:56', '2020-11-13 10:50:03');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (19, 'tomdickharry', 3, '00:48:23', '2020-11-11 17:10:55');
INSERT INTO `escape`.`round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES (20, 'leehsienloong', 3, '00:45:21', '2020-11-14 10:47:44');

COMMIT;


-- -----------------------------------------------------
-- Data for table `escape`.`objects`
-- -----------------------------------------------------
START TRANSACTION;
USE `escape`;
INSERT INTO `escape`.`objects` (`object_id`, `object_name`, `object_description`, `object_room`, `progress_value`) VALUES (1, 'dog', 'Picture of a dog', 1, 20);
INSERT INTO `escape`.`objects` (`object_id`, `object_name`, `object_description`, `object_room`, `progress_value`) VALUES (2, 'cat', 'Picture of a cat', 1, 20);
INSERT INTO `escape`.`objects` (`object_id`, `object_name`, `object_description`, `object_room`, `progress_value`) VALUES (3, 'owl', 'Picture of an owl', 1, 20);
INSERT INTO `escape`.`objects` (`object_id`, `object_name`, `object_description`, `object_room`, `progress_value`) VALUES (4, 'speakerOn', DEFAULT, 1, 40);
INSERT INTO `escape`.`objects` (`object_id`, `object_name`, `object_description`, `object_room`, `progress_value`) VALUES (11, 'sudoku', DEFAULT, 2, 50);
INSERT INTO `escape`.`objects` (`object_id`, `object_name`, `object_description`, `object_room`, `progress_value`) VALUES (12, 'slidingPuzzle', DEFAULT, 2, 50);
INSERT INTO `escape`.`objects` (`object_id`, `object_name`, `object_description`, `object_room`, `progress_value`) VALUES (5, 'frog', 'Picture of a frog', 1, 0);
INSERT INTO `escape`.`objects` (`object_id`, `object_name`, `object_description`, `object_room`, `progress_value`) VALUES (21, 'hangman', DEFAULT, 3, 30);
INSERT INTO `escape`.`objects` (`object_id`, `object_name`, `object_description`, `object_room`, `progress_value`) VALUES (22, 'circuit', DEFAULT, 3, 30);
INSERT INTO `escape`.`objects` (`object_id`, `object_name`, `object_description`, `object_room`, `progress_value`) VALUES (23, 'lockedFolder', DEFAULT, 3, 40);
INSERT INTO `escape`.`objects` (`object_id`, `object_name`, `object_description`, `object_room`, `progress_value`) VALUES (6, 'battery', 'Battery used to power common appliances', 1, 0);
INSERT INTO `escape`.`objects` (`object_id`, `object_name`, `object_description`, `object_room`, `progress_value`) VALUES (7, 'doll', 'Peculiar looking doll...', 1, 0);

COMMIT;


-- -----------------------------------------------------
-- Data for table `escape`.`round_objects`
-- -----------------------------------------------------
START TRANSACTION;
USE `escape`;
INSERT INTO `escape`.`round_objects` (`round_id`, `object_id`) VALUES (5, 1);
INSERT INTO `escape`.`round_objects` (`round_id`, `object_id`) VALUES (5, 2);
INSERT INTO `escape`.`round_objects` (`round_id`, `object_id`) VALUES (5, 4);
INSERT INTO `escape`.`round_objects` (`round_id`, `object_id`) VALUES (5, 11);
INSERT INTO `escape`.`round_objects` (`round_id`, `object_id`) VALUES (5, 12);
INSERT INTO `escape`.`round_objects` (`round_id`, `object_id`) VALUES (5, 5);
INSERT INTO `escape`.`round_objects` (`round_id`, `object_id`) VALUES (5, 21);
INSERT INTO `escape`.`round_objects` (`round_id`, `object_id`) VALUES (5, 22);
INSERT INTO `escape`.`round_objects` (`round_id`, `object_id`) VALUES (5, 23);

COMMIT;
