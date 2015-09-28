
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
  database : ''
});

connection.queryAsync("SHOW DATABASES;").then(
    function(results) {
    	var rows = results[0];
    	var arrayOfDatabases = [];
    	for ( var i=0; i < rows.length; i++ ) {
            arrayOfDatabases.push(rows[i].Database);
        }
        return arrayOfDatabases;
    }
).map(
    function(mappedArray) {
        connection.queryAsync("SHOW TABLES IN " + mappedArray + ";").then(
            function(results) {
                var tables = results[0];
                for (var i = 0; i < tables.length; i++) {
                    for (var j in tables[i]) {
                    console.log((mappedArray).bold.cyan, (tables[i][j]).rainbow);
                    }
                }
            }    
        );    
    }
).finally(
    function() {
        connection.end();
    }
);



