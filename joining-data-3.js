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

connection.queryAsync("SELECT (concat('#', Account.id, ':')) AS 'ID', Account.email, Account.password,\
                Account.createdOn, Account.modifiedOn, AddressBook.id AS AddressBookId, AddressBook.name, \
                AddressBook.createdOn AS AddressBookCreatedDate, AddressBook.modifiedOn AS AddressBookModifiedDate \
                FROM Account \
                JOIN AddressBook ON AddressBook.accountId = Account.id \
                ORDER BY Account.id;").spread(
    function(results) {
        var ids = [];
        for (var i = 0; i < results.length; i++) {
            if (ids.indexOf(results[i]['ID']) === -1) {
                ids.push(results[i]['ID']);
                console.log(results[i]['ID'].bold.yellow);
                console.log("\t" + results[i]['name'].rainbow);
            }
            else {
                console.log("\t" + results[i]['name'].rainbow);
            }
        }
    }
).finally(
    function() {
        connection.end();
    }
);
