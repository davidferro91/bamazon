# bamazon Customer and Manager Applications

David Ferro

## Description

This is a CLI application that uses a SQL database, initially created via MySQL Workbench and then coded using node.js that has a customer and a manager option for buying products, adding inventories, and adding products to our not copywrited "Bamazon" company.

### Customer Application

For customers, to login, they need to type in `node bamazoncustomer.js` into the command line from the directory with the file, and they will see the following.

![Image of initial customer use of application](/images/bamCust1.png)

From the list of items, we need to type in the ID of the product we would like to buy.  Once we do that, we are asked how many we would like to buy and if we are sure that we'd like to make our purchase.  If there's not enough stock, we are given a message on how much is available for purchase.

![Image of trying to buy too much](/images/bamCust2.png)

When the user types an amount that actually is available, they will be given their total and that it will be billed to their favorite credit card or other payment method.

![Image of buying actually going through](/images/bamCust3.png)

When you don't want to buy anything, just type in "0", you get the option to keep shopping, but then you can exit the application.

![Image of ending the customer application](/images/bamCust4.png)

### Manager Application

For managers, to login, they need to type in `node bamazonManager.js` into the command line from the directory with the file, and they will see the following.

![Image of initial manager use of the application](/images/bamMana1.png)

When they select `View Products for Sale`, they will see the whole list of products available.

![Image of the listing of products](/images/bamMana2.png)

And then someone almost bought out the Wax Tip Black Shoelaces.

![Image of the listing of products with only 1 unit of Wax Tip Black Shoelaces](/images/bamMana3.png)

So, to see the low inventory, we need to select the `View Low Inventory` option using the arrow keys.  The application will display the products that have less than 5 items.  So, you'll need to `Add to Inventory` to make up for the low stock.  If you type in an invalid ID, it will not work, but otherwise, you can choose how many items you'd like to add.

![Image of Low Inventory and Adding Products to Inventory](/images/bamMana4.png)

You can also add new products, by typing in the name of the product, the department, the price, and the amount in stock.

![Image of adding a product](/images/bamMana5.png)

If you have any questions, feel free to email me at david-ferro@sbcglobal.net.

Enjoy!