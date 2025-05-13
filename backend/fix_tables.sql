USE pizzeria_proj;

-- Disable foreign key checks temporarily
SET FOREIGN_KEY_CHECKS = 0;

-- Fix customers table to have AUTO_INCREMENT
ALTER TABLE customers MODIFY cust_id INT AUTO_INCREMENT;

-- Fix address table to have AUTO_INCREMENT
ALTER TABLE address MODIFY add_id INT AUTO_INCREMENT;

-- Fix orders table
ALTER TABLE orders MODIFY order_id VARCHAR(20) NOT NULL;

-- Re-enable foreign key checks
SET FOREIGN_KEY_CHECKS = 1;

-- Verify the changes
SELECT 'customers' as 'Table', column_type 
FROM information_schema.columns 
WHERE table_schema = 'pizzeria_proj' 
AND table_name = 'customers' 
AND column_name = 'cust_id'
UNION
SELECT 'address', column_type 
FROM information_schema.columns 
WHERE table_schema = 'pizzeria_proj' 
AND table_name = 'address' 
AND column_name = 'add_id'
UNION
SELECT 'orders', column_type 
FROM information_schema.columns 
WHERE table_schema = 'pizzeria_proj' 
AND table_name = 'orders' 
AND column_name = 'order_id'; 