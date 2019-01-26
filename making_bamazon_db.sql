CREATE DATABASE bamazon_db;

USE bamazon_db;

CREATE TABLE products (
item_id INT AUTO_INCREMENT NOT NULL PRIMARY KEY,
product_name VARCHAR(150) NOT NULL,
department_name VARCHAR(100) DEFAULT "Miscellaneous",
price DECIMAL(10, 2) NOT NULL,
stock_quantity INTEGER(11) DEFAULT 0
);

INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("The Beatles (White Album)", "Music - Vinyl, CD", 34.99, 1000),
("Schwinn Bicycle", "Sports Equipment", 349.99, 350),
("Swirly Bowling Ball", "Sports Equipment", 67.97, 200),
("Pieces of Eight", "Music - Vinyl, CD", 21.93, 300),
("BOZE Headphones", "Electronics", 132.56, 720),
("PS4 DualShock Controller", "Electronics", 67.89, 500),
("Bambino Style Wooden Dining Room Chair", "Furniture", 34.86, 301),
("Bambino Style Wooden Dining Room Table", "Furniture", 254.32, 103),
("Wax Tip Black Shoelaces", "Clothing", 4.99, 200),
("Flannel Pajama Pants", "Clothing", 32.99, 421);

SELECT * FROM products;