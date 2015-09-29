var mysql = require('mysql');
var Promise = require('bluebird');
var colors = require('colors');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});

connection.queryAsync("SELECT id, (concat('#', id, ':')) AS 'ID', email FROM Account LIMIT 10;").spread(
    function(results) {
        return results;
    }    
).map(
    function(accounts) {
        connection.queryAsync("SELECT name AS 'Name' FROM AddressBook WHERE accountId IN (" + accounts["id"] + ");").spread(
        function(results) {
            console.log(accounts['ID'].bold, "\t", accounts["email"].underline);
            return results;
        }).map(
            function(names) {
                console.log ("\t", names["Name"].yellow);
            }
        )
    }
).finally(
    function() {
        connection.end();
    }
);