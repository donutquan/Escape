-- phpMyAdmin SQL Dump
-- version 4.9.2
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1:3306
-- Generation Time: Nov 19, 2020 at 09:40 AM
-- Server version: 8.0.18
-- PHP Version: 7.3.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
SET AUTOCOMMIT = 0;
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `escape`
--
CREATE DATABASE IF NOT EXISTS `escape`;
USE `escape`;

-- --------------------------------------------------------

--
-- Table structure for table `account`
--

DROP TABLE IF EXISTS `account`;
CREATE TABLE IF NOT EXISTS `account` (
  `username` varchar(20) NOT NULL,
  `hashed_password` varchar(256) NOT NULL,
  PRIMARY KEY (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `account`
--

INSERT INTO `account` (`username`, `hashed_password`) VALUES
('burgerfries', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('chickenrice', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('cposkitt', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('davidlyj', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('escaper', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('hokkienmee', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('hongsengong', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('joelytj_', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('leehsienloong', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('lorem_ipsum', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('prataboy', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('tanahkow', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('todocraig.shoto', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('tomdickharry', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('user1', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('user2', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('user3', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('user4', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('user5', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga'),
('yuquanyeo', '$2y$10$dyumiiu7AIc30JG7SYhT2uVvGieJ1E1QH0OUgBL2T.8hpdc81UAga');

-- --------------------------------------------------------

--
-- Table structure for table `objects`
--

DROP TABLE IF EXISTS `objects`;
CREATE TABLE IF NOT EXISTS `objects` (
  `object_id` int(11) NOT NULL AUTO_INCREMENT,
  `object_name` varchar(50) NOT NULL,
  `object_description` varchar(45) NOT NULL,
  `object_room` int(11) NOT NULL,
  `progress_value` int(11) NOT NULL,
  PRIMARY KEY (`object_id`)
) ENGINE=InnoDB AUTO_INCREMENT=24 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `objects`
--

INSERT INTO `objects` (`object_id`, `object_name`, `object_description`, `object_room`, `progress_value`) VALUES
(1, 'dog', 'Picture of a dog', 1, 20),
(2, 'cat', 'Picture of a cat', 1, 20),
(3, 'owl', 'Picture of an owl', 1, 20),
(4, 'speakerOn', '', 1, 40),
(5, 'frog', 'Picture of a frog', 1, 0),
(6, 'battery', 'Battery used to power common appliances', 1, 0),
(7, 'doll', 'Peculiar looking doll...', 1, 0),
(11, 'sudoku', '', 2, 50),
(12, 'slidingPuzzle', '', 2, 50),
(21, 'hangman', '', 3, 30),
(22, 'circuit', '', 3, 30),
(23, 'lockedFolder', '', 3, 40);

-- --------------------------------------------------------

--
-- Table structure for table `round`
--

DROP TABLE IF EXISTS `round`;
CREATE TABLE IF NOT EXISTS `round` (
  `round_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(20) NOT NULL,
  `room_num` int(11) NOT NULL,
  `duration` time(6) NOT NULL,
  `complete_date` datetime DEFAULT NULL,
  PRIMARY KEY (`round_id`,`username`),
  KEY `fk_user_has_game_user_idx` (`username`)
) ENGINE=InnoDB AUTO_INCREMENT=21 DEFAULT CHARSET=utf8;

--
-- Dumping data for table `round`
--

INSERT INTO `round` (`round_id`, `username`, `room_num`, `duration`, `complete_date`) VALUES
(1, 'user1', 3, '00:58:31.000000', '2020-11-08 20:00:00'),
(2, 'user2', 2, '00:36:30.000000', NULL),
(3, 'user3', 3, '00:48:39.000000', NULL),
(4, 'user4', 3, '00:58:39.000000', '2020-11-08 10:00:00'),
(5, 'user1', 1, '00:00:01.000000', NULL),
(6, 'yuquanyeo', 3, '00:45:45.000000', '2020-11-14 10:10:32'),
(7, 'davidlyj', 3, '00:46:39.000000', '2020-11-13 11:30:45'),
(8, 'todocraig.shoto', 3, '00:53:23.000000', '2020-11-12 08:11:01'),
(9, 'joelytj_', 3, '00:53:55.000000', '2020-11-11 12:16:05'),
(10, 'cposkitt', 3, '00:42:35.000000', '2020-11-14 10:38:08'),
(11, 'hongsengong', 3, '00:43:55.000000', '2020-11-14 16:13:00'),
(12, 'tanahkow', 3, '00:56:54.000000', '2020-11-13 18:57:02'),
(13, 'escaper', 3, '00:35:30.000000', '2020-11-12 16:10:30'),
(14, 'lorem_ipsum', 3, '00:58:12.000000', '2020-11-14 20:46:21'),
(15, 'prataboy', 3, '00:49:48.000000', '2020-11-11 18:10:30'),
(16, 'chickenrice', 3, '00:59:50.000000', '2020-11-11 18:10:30'),
(17, 'burgerfries', 3, '00:51:52.000000', '2020-11-14 10:05:10'),
(18, 'hokkienmee', 3, '00:56:56.000000', '2020-11-13 10:50:03'),
(19, 'tomdickharry', 3, '00:48:23.000000', '2020-11-11 17:10:55'),
(20, 'leehsienloong', 3, '00:45:21.000000', '2020-11-14 10:47:44');

-- --------------------------------------------------------

--
-- Table structure for table `round_objects`
--

DROP TABLE IF EXISTS `round_objects`;
CREATE TABLE IF NOT EXISTS `round_objects` (
  `round_id` int(11) NOT NULL,
  `object_id` int(11) NOT NULL,
  PRIMARY KEY (`round_id`,`object_id`),
  KEY `fk_round_has_objects_objects1_idx` (`object_id`),
  KEY `fk_round_has_objects_round1_idx` (`round_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Dumping data for table `round_objects`
--

INSERT INTO `round_objects` (`round_id`, `object_id`) VALUES
(5, 1),
(5, 2),
(5, 4),
(5, 5),
(5, 11),
(5, 12),
(5, 21),
(5, 22),
(5, 23);

--
-- Constraints for dumped tables
--

--
-- Constraints for table `round`
--
ALTER TABLE `round`
  ADD CONSTRAINT `fk_user_has_game_user` FOREIGN KEY (`username`) REFERENCES `account` (`username`);

--
-- Constraints for table `round_objects`
--
ALTER TABLE `round_objects`
  ADD CONSTRAINT `fk_round_has_objects_objects1` FOREIGN KEY (`object_id`) REFERENCES `objects` (`object_id`),
  ADD CONSTRAINT `fk_round_has_objects_round1` FOREIGN KEY (`round_id`) REFERENCES `round` (`round_id`);
COMMIT;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
