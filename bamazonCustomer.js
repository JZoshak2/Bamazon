var mysql = require("mysql");
var inquire = require("inquirer");
var util = require('util');
var connection = mysql.createConnection({
  host: "localhost",
  port: 3306,
  user: "root",
  password: "2france2",
  database: "Bamazon"
});


connection.connect(function(err){
  if(err) throw err;
  console.log("conected as id " + connection.threadId);
});

connection.query("SELECT * FROM products", function(err, res){
  console.log(res);
});

inquire.prompt([
  {
    type: "input",
    name: "id_choice",
    message: "Input ID of Product you want to Buy!"
  },
  {
    type: "input",
    name: "amount_choice",
    message: "How many do you want to buy?"
  }
]).then(function(answers){

  connection.query("SELECT stock_quantity FROM products WHERE ?", {item_id: answers.id_choice}, function(err, res){
  if (answers.amount_choice > res[0].stock_quantity) {
    console.log("Sorry we're all out");
  }
  else {
    var newAmount = res[0].stock_quantity - answers.amount_choice;
    connection.query("UPDATE products SET ? WHERE ?", [{stock_quantity: newAmount}, {item_id: answers.id_choice}]);
    connection.query("SELECT price FROM products WHERE ?", {item_id: answers.id_choice}, function(err, res){
      console.log("Your total cost is: " + (res[0].price * answers.amount_choice));
    });

  }

});
});
