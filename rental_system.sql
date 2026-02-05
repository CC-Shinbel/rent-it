-- phpMyAdmin SQL Dump
-- version 5.2.1
-- https://www.phpmyadmin.net/
--
-- Host: 127.0.0.1
-- Generation Time: Feb 03, 2026 at 04:20 PM
-- Server version: 10.4.32-MariaDB
-- PHP Version: 8.2.12

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

--
-- Database: `rental_system`
--

-- --------------------------------------------------------

--
-- Table structure for table `calendar`
--

CREATE TABLE IF NOT EXISTS `calendar` (
  `calendar_id` int(11) NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `booked_date_from` date DEFAULT NULL,
  `booked_date_to` date DEFAULT NULL,
  `status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`calendar_id`),
  KEY `item_id` (`item_id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `cart`
--

CREATE TABLE IF NOT EXISTS `cart` (
  `id` int(11) NOT NULL,
  `user_id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `dispatch`
--

CREATE TABLE IF NOT EXISTS `dispatch` (
  `dispatch_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `admin_id` int(11) DEFAULT NULL,
  `pickup_date` date DEFAULT NULL,
  `return_date` date DEFAULT NULL,
  `customer_name` varchar(255) DEFAULT NULL,
  `customer_email` varchar(255) DEFAULT NULL,
  `contact_number` varchar(20) DEFAULT NULL,
  `venue` text DEFAULT NULL,
  `delivery_address` text DEFAULT NULL,
  `dispatch_status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`dispatch_id`),
  KEY `order_id` (`order_id`),
  KEY `admin_id` (`admin_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `favorites`
--

CREATE TABLE IF NOT EXISTS `favorites` (
  `favorite_id` int(11) NOT NULL,
  `id` int(11) NOT NULL,
  `item_id` int(11) NOT NULL,
  `added_at` timestamp NOT NULL DEFAULT current_timestamp(),
  PRIMARY KEY (`favorite_id`),
  KEY `id` (`id`),
  KEY `item_id` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Normalize favorites table for legacy databases before running inserts/index updates
ALTER TABLE `favorites`
  ADD COLUMN IF NOT EXISTS `favorite_id` int(11) NOT NULL,
  ADD COLUMN IF NOT EXISTS `id` int(11) NOT NULL,
  ADD COLUMN IF NOT EXISTS `item_id` int(11) NOT NULL,
  ADD COLUMN IF NOT EXISTS `added_at` timestamp NOT NULL DEFAULT current_timestamp();

SET @pk_exists = (
    SELECT COUNT(*)
    FROM INFORMATION_SCHEMA.TABLE_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND TABLE_NAME = 'favorites'
      AND CONSTRAINT_TYPE = 'PRIMARY KEY'
);
SET @sql = IF(@pk_exists = 0, 'ALTER TABLE `favorites` ADD PRIMARY KEY (`favorite_id`)', 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @pk_exists = NULL;
SET @sql = NULL;

-- --------------------------------------------------------

--
-- Table structure for table `item`
--

CREATE TABLE IF NOT EXISTS `item` (
  `item_id` int(11) NOT NULL,
  `item_name` varchar(255) NOT NULL,
  `description` text DEFAULT NULL,
  `category` varchar(100) DEFAULT NULL,
  `image` varchar(255) DEFAULT NULL,
  `rating` decimal(3,1) DEFAULT NULL,
  `reviews` int(11) DEFAULT NULL,
  `price_per_day` decimal(10,2) NOT NULL,
  `deposit` decimal(10,2) DEFAULT NULL,
  `condition` varchar(100) DEFAULT NULL,
  `status` varchar(50) DEFAULT 'available',
  `maintenance_notes` text DEFAULT NULL,
  `total_times_rented` int(11) DEFAULT 0,
  PRIMARY KEY (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `item`
--

INSERT IGNORE INTO `item` (`item_id`, `item_name`, `description`, `category`, `image`, `rating`, `reviews`, `price_per_day`, `deposit`, `condition`, `status`, `maintenance_notes`, `total_times_rented`) VALUES
(1, 'Karaoke King Pro v2', 'Professional dual-mic setup with 10k+ songs and built-in studio effects.', 'Premium', 'karaoke-king-v2.jpg', 4.5, 24, 120.00, NULL, NULL, 'Available', NULL, 0),
(2, 'EchoStream Portable', 'Battery powered, Bluetooth ready. Perfect for small gatherings and picnics.', 'Portable', 'echostream-portable.jpg', 5.0, 18, 65.00, NULL, NULL, 'Booked', NULL, 0),
(3, 'VocalStar 5000 Stage', 'Event-grade system with 4 microphones and integrated subwoofer.', 'Professional', 'vocalstar-5000.jpg', 4.2, 31, 250.00, NULL, NULL, 'Available', NULL, 0),
(4, 'HomeParty Ultra', 'Best seller. Features YouTube integration and scoring system.', 'Premium', 'homeparty-ultra.jpg', 4.8, 56, 120.00, NULL, NULL, 'Available', NULL, 0),
(5, 'MiniSing Pocket', 'Ultra-portable. Fits in a backpack. Surprise your friends anywhere!', 'Portable', 'minising-pocket.jpg', 3.5, 12, 120.00, NULL, NULL, 'Available', NULL, 0),
(6, 'Pro-Ject Rockbox', 'Heavy duty casing with high-fidelity sound output for outdoor events.', 'Professional', 'rockbox-pro.jpg', 4.7, 15, 180.00, NULL, NULL, 'Available', NULL, 0);

-- --------------------------------------------------------

--
-- Table structure for table `penalty_tracker`
--

CREATE TABLE IF NOT EXISTS `penalty_tracker` (
  `penalty_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `user_id` int(11) DEFAULT NULL,
  `penalty_type` varchar(100) DEFAULT NULL,
  `amount` decimal(10,2) DEFAULT NULL,
  `penalty_status` varchar(50) DEFAULT NULL,
  `issued_date` date DEFAULT NULL,
  PRIMARY KEY (`penalty_id`),
  KEY `order_id` (`order_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `rental`
--

CREATE TABLE IF NOT EXISTS `rental` (
  `order_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `rental_status` varchar(50) DEFAULT NULL,
  `total_price` decimal(10,2) DEFAULT NULL,
  `late_fee` decimal(10,2) DEFAULT 0.00,
  `venue` varchar(255) DEFAULT NULL,
  `customer_address` text DEFAULT NULL,
  `start_date` date DEFAULT NULL,
  `end_date` date DEFAULT NULL,
  PRIMARY KEY (`order_id`),
  KEY `fk_user_rental` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rental`
--

INSERT IGNORE INTO `rental` (`order_id`, `user_id`, `rental_status`, `total_price`, `late_fee`, `venue`, `customer_address`, `start_date`, `end_date`) VALUES
(502, 3, 'Pending Return', 6500.00, 0.00, NULL, NULL, '2026-02-03', '2026-02-08'),
(503, 3, 'Returned', 1500.00, 0.00, NULL, NULL, '2023-12-01', '2023-12-05'),
(504, 3, 'Active', 320.00, 0.00, 'Home Delivery', NULL, '2026-02-03', '2026-02-04');

-- --------------------------------------------------------

--
-- Table structure for table `rental_item`
--

CREATE TABLE IF NOT EXISTS `rental_item` (
  `rental_item_id` int(11) NOT NULL,
  `order_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `item_price` decimal(10,2) DEFAULT NULL,
  `item_status` varchar(50) DEFAULT NULL,
  PRIMARY KEY (`rental_item_id`),
  KEY `order_id` (`order_id`),
  KEY `item_id` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- Dumping data for table `rental_item`
--

INSERT IGNORE INTO `rental_item` (`rental_item_id`, `order_id`, `item_id`, `item_price`, `item_status`) VALUES
(8, 504, 1, 120.00, 'Rented');

-- --------------------------------------------------------

--
-- Table structure for table `repair`
--

CREATE TABLE IF NOT EXISTS `repair` (
  `repair_id` int(11) NOT NULL,
  `item_id` int(11) DEFAULT NULL,
  `order_id` int(11) DEFAULT NULL,
  `damage_description` text DEFAULT NULL,
  `repair_status` varchar(50) DEFAULT NULL,
  `repair_cost` decimal(10,2) DEFAULT NULL,
  `reported_date` date DEFAULT NULL,
  `resolved_date` date DEFAULT NULL,
  PRIMARY KEY (`repair_id`),
  KEY `item_id` (`item_id`),
  KEY `order_id` (`order_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `review`
--

CREATE TABLE IF NOT EXISTS `review` (
  `review_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `item_id` int(11) DEFAULT NULL,
  `rating` int(11) DEFAULT NULL CHECK (`rating` >= 1 and `rating` <= 5),
  `feedback` text DEFAULT NULL,
  `review_date` date DEFAULT NULL,
  PRIMARY KEY (`review_id`),
  KEY `user_id` (`user_id`),
  KEY `item_id` (`item_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- --------------------------------------------------------

--
-- Table structure for table `users`
--

CREATE TABLE IF NOT EXISTS `users` (
  `id` int(11) NOT NULL,
  `full_name` varchar(100) DEFAULT NULL,
  `email` varchar(100) NOT NULL,
  `phone` varchar(20) DEFAULT NULL,
  `password` varchar(255) NOT NULL,
  `profile_picture` longblob DEFAULT NULL,
  `id_front` longblob DEFAULT NULL,
  `id_back` longblob DEFAULT NULL,
  `address` text DEFAULT NULL,
  `role` enum('admin','customer') DEFAULT 'customer',
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  `reset_token` varchar(255) DEFAULT NULL,
  `reset_expiry` datetime DEFAULT NULL,
  `membership_level` varchar(20) DEFAULT 'Bronze',
  PRIMARY KEY (`id`),
  UNIQUE KEY `email` (`email`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Make sure legacy databases have the newer profile fields before inserts
ALTER TABLE `users`
  ADD COLUMN IF NOT EXISTS `profile_picture` LONGBLOB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `id_front` LONGBLOB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `id_back` LONGBLOB DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `address` TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `membership_level` VARCHAR(20) DEFAULT 'Bronze',
  ADD COLUMN IF NOT EXISTS `reset_token` VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `reset_expiry` DATETIME DEFAULT NULL;

--
-- Dumping data for table `users`
--

INSERT IGNORE INTO `users` (`id`, `full_name`, `email`, `phone`, `password`, `profile_picture`, `id_front`, `id_back`, `address`, `role`, `created_at`, `updated_at`, `reset_token`, `reset_expiry`, `membership_level`) VALUES
(1, 'Admin User', 'admin@certicode.com', '+639123456789', '$2y$10$N9qo8uLOickgx2ZMRZoMye7b6Zx7Z9z8C7qZ8J5QYb3zNQrNcXvHy', NULL, NULL, NULL, NULL, 'admin', '2026-01-29 13:24:26', '2026-01-29 13:24:26', NULL, NULL, 'Bronze'),
(2, 'shiro yashi', 'lpochea@bpsu.edu.ph', '+631231312312', '$2y$10$TxyCAtsPjqxO4mZUtFuTROIJ0RrZfNzmWFJJ61gH0g0ethuyjEUKy', NULL, NULL, NULL, NULL, 'customer', '2026-01-29 13:24:44', '2026-01-29 13:24:44', NULL, NULL, 'Bronze'),
(3, 'Via Umali', 'viaumali24@gmail.com', '09925228671', '$2y$10$DFt9IEwtSwxTAzntdGOu2u4qtZZKS53k0gA59BgZKNPh3gr9XhjPK', NULL, NULL, NULL, NULL, 'customer', '2026-01-30 01:30:40', '2026-02-03 02:29:34', NULL, NULL, 'Gold'),
(4, 'Via', 'viavinusumali@gmail.com', '09746873322', '$2y$10$ZkMHx7N1X0ThH/yGvjdqKO6dAZAEKyTxS8ggAauO750ik1qGJQxpi', NULL, NULL, NULL, NULL, 'customer', '2026-01-30 03:16:37', '2026-01-30 03:16:37', NULL, NULL, 'Bronze'),
(5, 'try try', 'via@gmail.com', '09124567890', '$2y$10$Lx42t0tANSNowiJw2lk0cORb8BpuRfR1LRWNMovb5M1JzXYb0BHHy', NULL, NULL, NULL, NULL, 'customer', '2026-01-30 03:20:15', '2026-01-30 03:20:15', NULL, NULL, 'Bronze'),
(6, 'via', 'viaa@gmail.com', '09124466897', '$2y$10$Fx8uDn7O52YpdLr5Zhq3F.i7gxoiti.LWSqOBvRxRXXF0Qd6xo1LW', NULL, NULL, NULL, NULL, 'customer', '2026-01-30 03:21:01', '2026-01-30 03:21:01', NULL, NULL, 'Bronze');

-- --------------------------------------------------------

--
-- Table structure for table `user_settings`
--

CREATE TABLE IF NOT EXISTS `user_settings` (
  `setting_id` int(11) NOT NULL,
  `user_id` int(11) DEFAULT NULL,
  `profile_picture` varchar(255) DEFAULT NULL,
  `address` text DEFAULT NULL,
  `updated_at` datetime DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`setting_id`),
  KEY `user_id` (`user_id`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `calendar`
--
ALTER TABLE `calendar`
  MODIFY `calendar_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `cart`
--
ALTER TABLE `cart`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=3;

--
-- AUTO_INCREMENT for table `dispatch`
--
ALTER TABLE `dispatch`
  MODIFY `dispatch_id` int(11) NOT NULL AUTO_INCREMENT;

--
SET @favorite_has_auto = (
    SELECT CASE WHEN EXTRA LIKE '%auto_increment%' THEN 1 ELSE 0 END
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'favorites'
      AND COLUMN_NAME = 'favorite_id'
    LIMIT 1
);
SET @favorite_is_pk = (
    SELECT CASE WHEN COLUMN_KEY = 'PRI' THEN 1 ELSE 0 END
    FROM INFORMATION_SCHEMA.COLUMNS
    WHERE TABLE_SCHEMA = DATABASE()
      AND TABLE_NAME = 'favorites'
      AND COLUMN_NAME = 'favorite_id'
    LIMIT 1
);

SET @sql = (
    SELECT CASE
        WHEN @favorite_is_pk = 1 AND @favorite_has_auto = 0 THEN 'ALTER TABLE `favorites` MODIFY `favorite_id` int(11) NOT NULL AUTO_INCREMENT'
        ELSE 'SELECT 1'
    END
);
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET @sql = 'ALTER TABLE `favorites` AUTO_INCREMENT = 15';
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;
SET @sql = NULL;
SET @favorite_has_auto = NULL;
SET @favorite_is_pk = NULL;

--
-- AUTO_INCREMENT for table `item`
--
ALTER TABLE `item`
  MODIFY `item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `penalty_tracker`
--
ALTER TABLE `penalty_tracker`
  MODIFY `penalty_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `rental`
--
ALTER TABLE `rental`
  MODIFY `order_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=505;

--
-- AUTO_INCREMENT for table `rental_item`
--
ALTER TABLE `rental_item`
  MODIFY `rental_item_id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=9;

--
-- AUTO_INCREMENT for table `repair`
--
ALTER TABLE `repair`
  MODIFY `repair_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `review`
--
ALTER TABLE `review`
  MODIFY `review_id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `users`
--
ALTER TABLE `users`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT, AUTO_INCREMENT=7;

--
-- AUTO_INCREMENT for table `user_settings`
--
ALTER TABLE `user_settings`
  MODIFY `setting_id` int(11) NOT NULL AUTO_INCREMENT;

--
SET @OLD_FOREIGN_KEY_CHECKS = @@FOREIGN_KEY_CHECKS;
SET FOREIGN_KEY_CHECKS = 0;

-- Helper to add each foreign key only if it is missing
SET @constraint_name = NULL;
SET @constraint_sql = NULL;
SET @constraint_exists = NULL;
SET @sql = NULL;

-- calendar_ibfk_1
SET @constraint_name = 'calendar_ibfk_1';
SET @constraint_sql = 'ALTER TABLE `calendar` ADD CONSTRAINT `calendar_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- calendar_ibfk_2
SET @constraint_name = 'calendar_ibfk_2';
SET @constraint_sql = 'ALTER TABLE `calendar` ADD CONSTRAINT `calendar_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `rental` (`order_id`) ON DELETE CASCADE';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- dispatch_ibfk_1
SET @constraint_name = 'dispatch_ibfk_1';
SET @constraint_sql = 'ALTER TABLE `dispatch` ADD CONSTRAINT `dispatch_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `rental` (`order_id`) ON DELETE CASCADE';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- dispatch_ibfk_2
SET @constraint_name = 'dispatch_ibfk_2';
SET @constraint_sql = 'ALTER TABLE `dispatch` ADD CONSTRAINT `dispatch_ibfk_2` FOREIGN KEY (`admin_id`) REFERENCES `users` (`id`) ON DELETE SET NULL';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- favorites_ibfk_1
SET @constraint_name = 'favorites_ibfk_1';
SET @constraint_sql = 'ALTER TABLE `favorites` ADD CONSTRAINT `favorites_ibfk_1` FOREIGN KEY (`id`) REFERENCES `users` (`id`) ON DELETE CASCADE';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- favorites_ibfk_2
SET @constraint_name = 'favorites_ibfk_2';
SET @constraint_sql = 'ALTER TABLE `favorites` ADD CONSTRAINT `favorites_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- penalty_tracker_ibfk_1
SET @constraint_name = 'penalty_tracker_ibfk_1';
SET @constraint_sql = 'ALTER TABLE `penalty_tracker` ADD CONSTRAINT `penalty_tracker_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `rental` (`order_id`) ON DELETE CASCADE';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- penalty_tracker_ibfk_2
SET @constraint_name = 'penalty_tracker_ibfk_2';
SET @constraint_sql = 'ALTER TABLE `penalty_tracker` ADD CONSTRAINT `penalty_tracker_ibfk_2` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- fk_user_rental
SET @constraint_name = 'fk_user_rental';
SET @constraint_sql = 'ALTER TABLE `rental` ADD CONSTRAINT `fk_user_rental` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- rental_item_ibfk_1
SET @constraint_name = 'rental_item_ibfk_1';
SET @constraint_sql = 'ALTER TABLE `rental_item` ADD CONSTRAINT `rental_item_ibfk_1` FOREIGN KEY (`order_id`) REFERENCES `rental` (`order_id`) ON DELETE CASCADE';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- rental_item_ibfk_2
SET @constraint_name = 'rental_item_ibfk_2';
SET @constraint_sql = 'ALTER TABLE `rental_item` ADD CONSTRAINT `rental_item_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- repair_ibfk_1
SET @constraint_name = 'repair_ibfk_1';
SET @constraint_sql = 'ALTER TABLE `repair` ADD CONSTRAINT `repair_ibfk_1` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- repair_ibfk_2
SET @constraint_name = 'repair_ibfk_2';
SET @constraint_sql = 'ALTER TABLE `repair` ADD CONSTRAINT `repair_ibfk_2` FOREIGN KEY (`order_id`) REFERENCES `rental` (`order_id`) ON DELETE SET NULL';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- review_ibfk_1
SET @constraint_name = 'review_ibfk_1';
SET @constraint_sql = 'ALTER TABLE `review` ADD CONSTRAINT `review_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE SET NULL';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- review_ibfk_2
SET @constraint_name = 'review_ibfk_2';
SET @constraint_sql = 'ALTER TABLE `review` ADD CONSTRAINT `review_ibfk_2` FOREIGN KEY (`item_id`) REFERENCES `item` (`item_id`) ON DELETE CASCADE';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

-- user_settings_ibfk_1
SET @constraint_name = 'user_settings_ibfk_1';
SET @constraint_sql = 'ALTER TABLE `user_settings` ADD CONSTRAINT `user_settings_ibfk_1` FOREIGN KEY (`user_id`) REFERENCES `users` (`id`) ON DELETE CASCADE';
SET @constraint_exists = (
    SELECT COUNT(*) FROM INFORMATION_SCHEMA.REFERENTIAL_CONSTRAINTS
    WHERE CONSTRAINT_SCHEMA = DATABASE()
      AND CONSTRAINT_NAME = @constraint_name
);
SET @sql = IF(@constraint_exists = 0, @constraint_sql, 'SELECT 1');
PREPARE stmt FROM @sql;
EXECUTE stmt;
DEALLOCATE PREPARE stmt;

SET FOREIGN_KEY_CHECKS = @OLD_FOREIGN_KEY_CHECKS;
COMMIT;

-- --------------------------------------------------------
--
-- Safe Schema Updates - Add missing columns if they don't exist
-- These ALTER TABLE commands use IF NOT EXISTS so they can be re-run safely
--
-- --------------------------------------------------------

ALTER TABLE `rental`
  ADD COLUMN IF NOT EXISTS `late_fee` DECIMAL(10,2) DEFAULT 0.00,
  ADD COLUMN IF NOT EXISTS `venue` VARCHAR(255) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `customer_address` TEXT DEFAULT NULL;

ALTER TABLE `item`
  ADD COLUMN IF NOT EXISTS `deposit` DECIMAL(10,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `condition` VARCHAR(100) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `maintenance_notes` TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `total_times_rented` INT(11) DEFAULT 0;

ALTER TABLE `rental_item`
  ADD COLUMN IF NOT EXISTS `item_status` VARCHAR(50) DEFAULT NULL;

ALTER TABLE `dispatch`
  ADD COLUMN IF NOT EXISTS `delivery_address` TEXT DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS `dispatch_status` VARCHAR(50) DEFAULT NULL;

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
