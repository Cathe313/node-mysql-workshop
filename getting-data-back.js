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

connection.queryAsync("SELECT (concat('#', id, ':')) AS 'ID', email FROM Account LIMIT 10;").spread(
    function(results) {
    	return results;
    }    
).map(
    function(accounts) {
        console.log(accounts["ID"].bold, "\t", accounts["email"]);
    }
).finally(
    function() {
        connection.end();
    }
);

/*

connection.queryAsync("SELECT * FROM Accounts LIMIT 10;").then(
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
        return connection.queryAsync("SHOW TABLES IN " + mappedArray + ";")
        .spread(
            function(results, otherStuff) {
                var tableNames = results.map(function(mappedResults) {
                    return mappedResults['Tables_in_' + mappedArray];
                });
                return {
                    databaseName: mappedArray,
                    tableNames: tableNames
                };
            }    
        );    
    }
).then(
    function(databases) {
        databases.forEach(function(dbAndTables){
            console.log(dbAndTables.databaseName.bold.cyan);
            dbAndTables.tableNames.forEach(function(tableName){
                console.log("\t" + tableName.rainbow);
            });
        });
    }
).finally(
    function() {
        connection.end();
    }
);


*/


