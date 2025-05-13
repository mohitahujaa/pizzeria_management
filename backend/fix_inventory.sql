-- Drop the existing inventory table
DROP TABLE IF EXISTS inventory;

-- Recreate the inventory table with correct foreign key
CREATE TABLE inventory (
    inv_id INT PRIMARY KEY AUTO_INCREMENT,
    ing_id VARCHAR(10),
    quantity INT NOT NULL,
    FOREIGN KEY (ing_id) REFERENCES ingredient(ing_id)
);

-- Insert sample ingredients first
INSERT INTO ingredient (ing_id, ing_name, ing_weight, ing_meas, ing_price) VALUES
('ING001', 'Mozzarella Cheese', 1000, 'grams', 4.99),
('ING002', 'Tomato Sauce', 500, 'ml', 2.99),
('ING003', 'Pepperoni', 500, 'grams', 3.99),
('ING004', 'Pizza Dough', 1000, 'grams', 2.50),
('ING005', 'Mushrooms', 250, 'grams', 1.99),
('ING006', 'Bell Peppers', 300, 'grams', 1.50),
('ING007', 'Onions', 500, 'grams', 1.00),
('ING008', 'Ham', 500, 'grams', 3.50),
('ING009', 'Pineapple', 400, 'grams', 2.00),
('ING010', 'Chicken', 750, 'grams', 4.50),
-- Add beverage and dessert items as ingredients
('BEV001', 'Cola', 330, 'ml', 1.50),
('BEV002', '7 UP', 330, 'ml', 1.50),
('BEV003', 'Sprite', 330, 'ml', 1.50),
('DST001', 'Chocolate Icecream', 500, 'ml', 3.99),
('DST002', 'Pistachio Icecream', 500, 'ml', 3.99);

-- Insert inventory data
INSERT INTO inventory (ing_id, quantity) VALUES
('ING001', 15),  -- Mozzarella Cheese
('ING002', 8),   -- Tomato Sauce
('ING003', 12),  -- Pepperoni
('ING004', 20),  -- Pizza Dough
('ING005', 4),   -- Mushrooms (low stock)
('ING006', 6),   -- Bell Peppers
('ING007', 3),   -- Onions (very low stock)
('ING008', 10),  -- Ham
('ING009', 7),   -- Pineapple
('ING010', 9),   -- Chicken
-- Add inventory for beverages and desserts
('BEV001', 100), -- Cola
('BEV002', 100), -- 7 UP
('BEV003', 100), -- Sprite
('DST001', 50),  -- Chocolate Icecream
('DST002', 50);  -- Pistachio Icecream 