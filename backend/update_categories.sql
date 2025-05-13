USE pizzeria_proj;

-- Update category names to the correct values
UPDATE item 
SET item_cat = 'Side' 
WHERE item_cat = 'Sides';

UPDATE item 
SET item_cat = 'Dessert' 
WHERE item_cat = 'Desserts';

UPDATE item 
SET item_cat = 'Beverage' 
WHERE item_cat = 'Drinks';

-- Verify the changes
SELECT DISTINCT item_cat FROM item ORDER BY item_cat; 