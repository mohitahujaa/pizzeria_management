use pizzeria_proj;
CREATE TABLE customers(
cust_id INT primary key,
cust_firstname varchar(50) not null,
cust_lastname varchar(50) not null
);

CREATE TABLE address(
add_id INT primary key,
delivery_address1 varchar(50) not null,
delivery_address2 varchar(50),
delivery_city VARCHAR(50) NOT NULL,
delivery_zipcode VARCHAR(20) NOT NULL
);

CREATE TABLE item (
    item_id VARCHAR(10) PRIMARY KEY,
    sku VARCHAR(20) NOT NULL,
    item_name VARCHAR(100) NOT NULL,
    item_cat VARCHAR(100) NOT NULL,
    item_size VARCHAR(10),
    item_price DECIMAL(10,2) NOT NULL
);
ALTER TABLE item ADD CONSTRAINT UNIQUE (sku);


CREATE TABLE orders (
    row_id INT PRIMARY KEY AUTO_INCREMENT,
    order_id VARCHAR(10) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    item_id VARCHAR(10),
    quantity INT NOT NULL,
    cust_id INT,
    delivery BOOLEAN,
    add_id INT,
    FOREIGN KEY (item_id) REFERENCES item(item_id),
    FOREIGN KEY (cust_id) REFERENCES customers(cust_id),
    FOREIGN KEY (add_id) REFERENCES address(add_id)
);

CREATE TABLE ingredient (
    ing_id VARCHAR(10) PRIMARY KEY,
    ing_name VARCHAR(200) NOT NULL,
    ing_weight INT NOT NULL,
    ing_meas VARCHAR(20) NOT NULL,
    ing_price DECIMAL(5,2) NOT NULL
);

CREATE TABLE recipe (
    row_id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_id VARCHAR(20) NOT NULL,
    ing_id VARCHAR(10),
    quantity INT NOT NULL,
    FOREIGN KEY (ing_id) REFERENCES ingredient(ing_id),
    FOREIGN KEY (recipe_id) REFERENCES item(sku)
);

CREATE TABLE inventory (
    inv_id INT PRIMARY KEY AUTO_INCREMENT,
    item_id VARCHAR(10),
    quantity INT NOT NULL,
    FOREIGN KEY (item_id) REFERENCES item(item_id)
);

CREATE TABLE staff (
    staff_id VARCHAR(20) PRIMARY KEY,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    position VARCHAR(100) NOT NULL,
    hourly_rate DECIMAL(5,2) NOT NULL
);

CREATE TABLE shift (
    shift_id VARCHAR(20) PRIMARY KEY,
    day_of_week VARCHAR(10) NOT NULL,
    start_time TIME NOT NULL,
    end_time TIME NOT NULL
);

CREATE TABLE rota (
    row_id INT PRIMARY KEY AUTO_INCREMENT,
    rota_id VARCHAR(20) NOT NULL,
    date DATETIME DEFAULT CURRENT_TIMESTAMP,
    shift_id VARCHAR(20),
    staff_id VARCHAR(20),
    FOREIGN KEY (shift_id) REFERENCES shift(shift_id),
    FOREIGN KEY (staff_id) REFERENCES staff(staff_id)
);

set foreign_key_checks = 0;

select * from customers;
select * from address;
select * from orders;
select * from item;
select * from ingredient;
select * from recipe;
select * from rota;
select * from shift;
select * from staff;

insert into orders values(1, "ORD00001", "2025-04-03 02:51:00", 5, 2, 84, FALSE, 67); 
delete from orders where row_id = 1;

LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/orders.csv'
INTO TABLE orders
FIELDS TERMINATED BY ',' 
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@row_id, @order_id, @created_at, @item_id, @quantity, @cust_id, @delivery, @add_id)
SET created_at = STR_TO_DATE(@created_at, '%m/%d/%Y %H:%i'),
    order_id = @order_id,
    item_id = @item_id,
    quantity = @quantity,
    cust_id = @cust_id,
    delivery = @delivery,
    add_id = @add_id;
    
    SHOW VARIABLES LIKE 'secure_file_priv';
    
LOAD DATA INFILE 'C:/ProgramData/MySQL/MySQL Server 8.0/Uploads/rota.csv'
INTO TABLE rota
FIELDS TERMINATED BY ','
ENCLOSED BY '"'
LINES TERMINATED BY '\n'
IGNORE 1 ROWS
(@row_id, @rota_id, @date, @shift_id, @staff_id)
SET date = STR_TO_DATE(@date, '%m/%d/%Y'),
    row_id = @row_id,
    rota_id = @rota_id,
    shift_id = @shift_id,
    staff_id = @staff_id;
    
    
    delete 
    from orders
    where row_id > 102;
    
    /* DASHBOARD FOR ORDERS ACTIVITY */
select
o.order_id,
i.item_name,
i.item_price,
o.quantity,
o.delivery,
o.created_at
from orders o, item i
where o.item_id = i.item_id;
select * from orders
Order by item_id asc;





set sql_safe_updates = 0;
select order_id, item_id
from orders
where item_id IS NOT NULL
ORDER BY item_id;

    
    
    
    

