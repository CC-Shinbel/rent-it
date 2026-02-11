-- =====================================================
-- Admin Accounts Table
-- Stores admin login credentials in the database
-- Default: username=admin1, password=admin1 (bcrypt hashed)
-- =====================================================

CREATE TABLE IF NOT EXISTS `admin_accounts` (
  `admin_id` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(50) NOT NULL,
  `password` varchar(255) NOT NULL,
  `full_name` varchar(100) DEFAULT 'Admin',
  `email` varchar(100) DEFAULT NULL,
  `created_at` timestamp NOT NULL DEFAULT current_timestamp(),
  `updated_at` timestamp NOT NULL DEFAULT current_timestamp() ON UPDATE current_timestamp(),
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `username` (`username`)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

-- Insert default admin account (username: admin1, password: admin1)
-- Password hash generated with password_hash('admin1', PASSWORD_BCRYPT)
INSERT INTO `admin_accounts` (`username`, `password`, `full_name`, `email`) VALUES
('admin1', '$2y$10$YKBKxMGP0rMNJx0E5PJzAOzLSmBLeKaSk1oVZpHDBv7fBRkfdWpLi', 'Admin User', 'admin@certicode.com')
ON DUPLICATE KEY UPDATE `admin_id` = `admin_id`;
