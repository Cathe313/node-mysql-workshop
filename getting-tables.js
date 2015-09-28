
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

/*var tables = results[0];
                for (var i = 0; i < tables.length; i++) {
                    for (var j in tables[i]) {
                    console.log((mappedArray).bold.cyan, (tables[i][j]).rainbow);
                    }
                }*/

[1,2,3].map(function(element) {
    return element + 1;
});

[2,3,4];