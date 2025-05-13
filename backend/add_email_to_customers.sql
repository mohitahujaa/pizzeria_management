USE pizzeria_proj;

-- Add email column to customers table
ALTER TABLE customers ADD COLUMN email VARCHAR(100);
ALTER TABLE customers ADD UNIQUE (email);

-- Update existing records with dummy emails (if any)
UPDATE customers 
SET email = CONCAT(LOWER(cust_firstname), '.', LOWER(cust_lastname), '@example.com')
WHERE email IS NULL; 