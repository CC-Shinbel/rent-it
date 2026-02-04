-- Dashboard Sample Data
-- Run this SQL in phpMyAdmin to populate the dashboard with sample data
-- Make sure the rental_system database is selected

-- Add more sample rental data for dashboard display
INSERT INTO `rental` (`order_id`, `user_id`, `rental_status`, `total_price`, `late_fee`, `venue`, `customer_address`, `start_date`, `end_date`) VALUES
(505, 2, 'Booked', 360.00, 0.00, 'Birthday Party', 'Makati City', '2026-02-04', '2026-02-06'),
(506, 3, 'Active', 500.00, 0.00, 'Wedding Reception', 'Taguig City', '2026-02-03', '2026-02-05'),
(507, 4, 'Pending', 240.00, 0.00, 'Home Delivery', 'Quezon City', '2026-02-04', '2026-02-05'),
(508, 5, 'In Transit', 650.00, 0.00, 'Corporate Event', 'Pasig City', '2026-02-04', '2026-02-08'),
(509, 6, 'Confirmed', 180.00, 0.00, 'Birthday Party', 'Manila', '2026-02-05', '2026-02-06'),
(510, 2, 'Booked', 750.00, 0.00, 'Fiesta Celebration', 'Caloocan', '2026-02-06', '2026-02-09'),
(511, 3, 'Pending Return', 420.00, 0.00, 'Reunion', 'Paranaque', '2026-02-01', '2026-02-04');

-- Add rental items for the new rentals
INSERT INTO `rental_item` (`rental_item_id`, `order_id`, `item_id`, `item_price`, `item_status`) VALUES
(9, 505, 1, 120.00, 'Reserved'),
(10, 505, 4, 120.00, 'Reserved'),
(11, 506, 3, 250.00, 'Rented'),
(12, 506, 6, 180.00, 'Rented'),
(13, 507, 2, 65.00, 'Reserved'),
(14, 507, 5, 120.00, 'Reserved'),
(15, 508, 3, 250.00, 'In Transit'),
(16, 508, 1, 120.00, 'In Transit'),
(17, 509, 4, 120.00, 'Reserved'),
(18, 510, 3, 250.00, 'Reserved'),
(19, 510, 6, 180.00, 'Reserved'),
(20, 511, 2, 65.00, 'Rented');

-- Update some items to show different statuses for inventory display
UPDATE `item` SET `status` = 'Booked' WHERE `item_id` = 2;
UPDATE `item` SET `status` = 'Under Repair' WHERE `item_id` = 5;

-- Add dispatch information for today's schedule
INSERT INTO `dispatch` (`dispatch_id`, `order_id`, `admin_id`, `pickup_date`, `return_date`, `customer_name`, `customer_email`, `contact_number`, `venue`, `delivery_address`, `dispatch_status`) VALUES
(1, 505, 1, '2026-02-04', '2026-02-06', 'shiro yashi', 'lpochea@bpsu.edu.ph', '+631231312312', 'Birthday Party', 'Makati City', 'Scheduled'),
(2, 507, 1, '2026-02-04', '2026-02-05', 'Via', 'viavinusumali@gmail.com', '09746873322', 'Home Delivery', 'Quezon City', 'Pending'),
(3, 508, 1, '2026-02-04', '2026-02-08', 'try try', 'via@gmail.com', '09124567890', 'Corporate Event', 'Pasig City', 'In Transit'),
(4, 511, 1, '2026-02-01', '2026-02-04', 'Via Umali', 'viaumali24@gmail.com', '09925228671', 'Reunion', 'Paranaque', 'Pickup Scheduled');
