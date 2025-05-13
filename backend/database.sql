-- Create database if it doesn't exist
CREATE DATABASE IF NOT EXISTS pizzeria;

-- Use the pizzeria database
USE pizzeria;

-- Create items table
CREATE TABLE IF NOT EXISTS items (
  item_id VARCHAR(10) PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  description TEXT,
  price DECIMAL(10,2) NOT NULL
);

-- Insert sample data
INSERT INTO items (item_id, name, description, price) VALUES
('it01', 'Pepperoni Pizza', 'Classic pepperoni with mozzarella and our signature tomato sauce', 14.62),
('it02', 'Pepperoni Pizza', 'Classic pepperoni with mozzarella and our signature tomato sauce', 17.50),
('it03', 'Meat Feast Pizza', 'Loaded with pepperoni, ham, bacon, and Italian sausage', 11.63),
('it04', 'Meat Feast Pizza', 'Loaded with pepperoni, ham, bacon, and Italian sausage', 19.40),
('it05', 'Hawaiian Pizza', 'Ham, pineapple, and mozzarella on our signature tomato sauce', 14.81),
('it06', 'Hawaiian Pizza', 'Ham, pineapple, and mozzarella on our signature tomato sauce', 7.56),
('it07', 'Margherita Pizza', 'Fresh tomatoes, mozzarella, basil, and extra virgin olive oil', 17.91),
('it08', 'Margherita Pizza', 'Fresh tomatoes, mozzarella, basil, and extra virgin olive oil', 11.80),
('it09', 'Veggie Pizza', 'Bell peppers, mushrooms, onions, olives, and fresh tomatoes', 13.99),
('it10', 'Veggie Pizza', 'Bell peppers, mushrooms, onions, olives, and fresh tomatoes', 11.41),
('it11', 'BBQ Chicken Pizza', 'Grilled chicken, red onions, and BBQ sauce with mozzarella', 12.84),
('it12', 'BBQ Chicken Pizza', 'Grilled chicken, red onions, and BBQ sauce with mozzarella', 6.22),
('it13', 'Coca Cola', 'Refreshing cola drink', 60.00),
('it14', '7 UP', 'Crisp lemon-lime soda', 12.29),
('it15', 'Garlic Bread', 'Fresh baked bread with garlic butter', 10.40),
('it16', 'Chicken Wings', 'Crispy wings with your choice of sauce', 13.09),
('it17', 'Breadsticks', 'Freshly baked breadsticks with marinara sauce', 7.00),
('it18', 'Chocolate Icecream', 'Rich and creamy chocolate ice cream', 11.83),
('it19', 'Pistachio Icecream', 'Smooth pistachio flavored ice cream', 11.72),
('it20', 'Coca Cola', 'Refreshing cola drink', 19.95);

-- Create customers table
CREATE TABLE IF NOT EXISTS customers (
  customer_id INT PRIMARY KEY AUTO_INCREMENT,
  first_name VARCHAR(50) NOT NULL,
  last_name VARCHAR(50) NOT NULL,
  address_line1 VARCHAR(100) NOT NULL,
  address_line2 VARCHAR(100),
  city VARCHAR(50) NOT NULL,
  zip_code VARCHAR(5) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4;

-- Modify customers table to add AUTO_INCREMENT
ALTER TABLE customers MODIFY cust_id INT AUTO_INCREMENT; 