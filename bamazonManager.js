require("dotenv").config();
var mysql = require("mysql");
var inquirer = require("inquirer");
var keys = require("./keys.js");

var connection = mysql.createConnection(keys.MySQL);

connection.connect(function(err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    optionsMenu();
});

function optionsMenu() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product", "EXIT"],
            name: "selection"
        }
    ]).then( function (input) {
        var selection = input.selection;
        switch (selection) {
            case "View Products for Sale":
            return viewProducts();

            case "View Low Inventory":
            return viewLowInventory();

            case "Add to Inventory":
            return addToInventory();

            case "Add New Product":
            return addNewProduct();

            case "EXIT":
            return endRunning();
        }
    });
}

function endRunning () {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Are you sure that you would like to exit?",
            name: "confirm"
        }
    ]).then(function(reply) {
        if (reply.confirm === false) {
            optionsMenu();
        } 
        else {
            console.log("Thank you for using the Bamazon Manager Application.  Goodbye.");
            connection.end();
        }
    });  
}

function consoleDivider () {
    console.log("===========================================");
}

function validateInt(num) {
   var reg = /^\d+$/;
   return reg.test(num) || "This should be a nonnegative integer.";
}

function viewProducts () {
    let select = "SELECT products.item_id, products.product_name, products.price, products.stock_quantity FROM products";
    connection.query(select, function(err, response) {
        if (err) throw err;
        consoleDivider();
        for (var i = 0; i < response.length; i++) {
            console.log("Item ID: " + response[i].item_id + " | Product Name: " + response[i].product_name + " | Price: $" + response[i].price + " | Stock Quantity: " + response[i].stock_quantity); 
        }
        consoleDivider();
        optionsMenu();
    });
}

function viewLowInventory () {
    let select = "SELECT products.item_id, products.product_name, products.price, products.stock_quantity FROM products WHERE stock_quantity < 5";
    connection.query(select, function(err, response) {
        if (err) throw err;
        consoleDivider();
        console.log("Low Inventory:");
        for (var i = 0; i < response.length; i++) {
            console.log("Item ID: " + response[i].item_id + " | Product Name: " + response[i].product_name + " | Price: $" + response[i].price + " | Stock Quantity: " + response[i].stock_quantity); 
        }
        consoleDivider();
        optionsMenu();
    });
}

function addToInventory () {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the ID of the product to which you would like to add more inventory?",
            name: "id_selector",
            validate: validateInt
        }
    ]).then(function(selection) {
        let select = "SELECT products.item_id, products.stock_quantity FROM products WHERE ?"
        connection.query(select, [{item_id: selection.id_selector}], function(err, res) {
            if (err) throw err;
            if (res.length === 0) {
                console.log("Sorry, that is not a valid product ID.");
                optionsMenu();
            } else {
                inquirer.prompt([
                    {
                        type: "input",
                        message: "How many inventory units would you like to add?",
                        name: "inventory_amount",
                        validate: validateInt
                    }
                ]).then(function(input) {
                    let newQuantity = res[0].stock_quantity;
                    newQuantity += parseInt(input.inventory_amount);
                    let update = "UPDATE products SET ? WHERE ?";
                    connection.query(
                        update,
                        [{
                            stock_quantity: newQuantity
                        },
                        {
                            item_id: selection.id_selector
                        }], 
                        function (error, response) {
                            if (error) throw error;
                            console.log(response.affectedRows + " product inventory updated.");
                            viewProducts();
                    });
                });
            }
        }); 
    });  
}

function validateDec (num) {
    return ((parseFloat(num) === parseFloat(parseFloat(num).toFixed(2))) && (num == parseFloat(num).toFixed(2))) || "This should be a decimal value to two places after the decimal point.";
}
function validateWord (str) {
    return (str.length > 0 && isNaN(str)) || "Please type in a word for the name.";
}

function addNewProduct () {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the name of the product that you would like to add?",
            name: "name",
            validate: validateWord
        },
        {
            type: "input",
            message: "What is the name of department for this product?",
            name: "department",
            validate: validateWord
        },
        {
            type: "input",
            message: "What is the price for one of this product?",
            name: "price",
            validate: validateDec
        },
        {
            type: "input",
            message: "How many units of this product are available?",
            name: "quantity",
            validate: validateInt
        }
    ]).then(function(input) {
        inquirer.prompt([
            {
                type: "confirm",
                message: "You are about to add " + input.name + " to the " + input.department + " department for a price of $" + input.price + " and a stock quantity of " + input.quantity + " units.  Are you sure?",
                name: "confirm"
            }
        ]).then(function(complete) {
            if (complete.confirm) {
                let insert = "INSERT INTO products SET ?";
                connection.query(
                    insert,
                    [{
                        product_name: input.name,
                        department_name: input.department,
                        price: input.price,
                        stock_quantity: input.quantity
                    }],
                    function(err, res) {
                        if (err) throw err;
                        console.log(res.affectedRows + " product added.");
                        optionsMenu();
                    }
                );
            } else {
                optionsMenu();
            }
        });  
    });
}