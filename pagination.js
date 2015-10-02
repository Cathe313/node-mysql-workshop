var mysql = require('mysql');
var Promise = require('bluebird');
var colors = require('colors');
var prompt = require('prompt');
prompt = Promise.promisifyAll(prompt);
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});

function query (count) {
    connection.queryAsync("SELECT id, (concat('#', id, ':')) AS 'ID', email FROM Account LIMIT " + count + "," + (count + 10) + ";").spread(
        function(results) {
            for (var i = 0; i < 10; i++) {
                console.log(colors.bold(results[i]['ID']), "\t" + results[i]['email']);
            }
        	return results;
        }    
    ).then(
        function(){
            if (count < 990) {
                count += 10;
            }
            else {
                console.log("There's nothing more to show!");
                return connection.end();
            }    
            console.log('Do you want to continue? Answer yes or no.');
            prompt.start();
            prompt.getAsync(["more"], function(err, response) {
                if (response.more.toLowerCase() === "yes" || response.more.toLowerCase() === "y") {
                    query(count);
                }
                else {
                    return connection.end();
                }
            });
        }
    ).catch(
        function(error){
            console.log('There as an ' + error);
        }
    );
}

query(0);