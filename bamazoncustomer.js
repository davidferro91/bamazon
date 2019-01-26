require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var keys = require("./keys.js");

var connection = mysql.createConnection(keys.MySQL);

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    displayItems();
});

function displayItems() {
    let select = "SELECT products.item_id, products.product_name, products.price FROM products";
    connection.query(select, function(err, response) {
        if (err) throw err;
        consoleDivider();
        for (var i = 0; i < response.length; i++) {
            console.log("Item ID: " + response[i].item_id + " | Product Name: " + response[i].product_name + " | Price: $" + response[i].price); 
        }
        consoleDivider();
        buyProduct();
    });
}

function endRunning () {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to continue shopping?",
            name: "confirm"
        }
    ]).then(function(reply) {
        if (reply.confirm === true) {
            displayItems();
        } 
        else {
            console.log("Thanks for shopping!  Come again soon!");
            connection.end();
        }
    });  
}

function consoleDivider () {
    console.log("===========================================");
}

function validateNum(num)
{
   var reg = /^\d+$/;
   return reg.test(num) || "ID should be a number.";
}

function buyProduct () {
    inquirer.prompt([
        {
            type: "input",
            message: "Please type in the ID of the product that you would like to purchase.  If you would not like to purchase anything, type in \"0\".",
            name: "id_input",
            validate: validateNum
        }
    ]).then(function(ans) {
        if (ans.id_input === "0") {
            endRunning();
        }
        else {
            inquirer.prompt([
                {
                    type: "input",
                    message: "How many would you like to buy?",
                    name: "quantity",
                    validate: validateNum
                },
                {
                    type: "confirm",
                    message: "Are you sure?",
                    name: "confirm"
                }
            ]).then(function(res) {
                if (res.confirm === false) {
                    endRunning();
                } 
                else {
                    let select = "SELECT products.price, products.stock_quantity, products.product_name, products.product_sales FROM products WHERE ?";
                    connection.query(select, [{item_id: ans.id_input}], function(err, response) {
                        if (err) throw err;
                        if (res.quantity > response[0].stock_quantity) {
                            console.log("There is insufficient supply for that quantity.  We can only supply " + response[0].stock_quantity + ".");
                            buyProduct();
                        } else {
                            let newQuantity = response[0].stock_quantity;
                            newQuantity -= res.quantity;
                            let update = "UPDATE products SET ? WHERE ?";
                            connection.query(
                                update, 
                                [{
                                    stock_quantity: newQuantity
                                },
                                {
                                    item_id: ans.id_input
                                }], 
                                function(err, res) {
                                    if (err) throw err;
                                }
                            );
                            let cost = response[0].price;
                            let totalCost = res.quantity * cost;
                            console.log("The cost for a quantity of \"" + res.quantity + "\" of the product \"" + response[0].product_name + "\" is $" + totalCost.toFixed(2) + ".  You will be billed with your preferred payment method.");
                            let sales = response[0].product_sales;
                            sales += totalCost;
                            connection.query(
                                update,
                                [{
                                    product_sales: sales
                                },
                                {
                                    item_id:ans.id_input
                                }]
                            )
                            endRunning();
                        }
                    });
                }
            });
        }
    });
}