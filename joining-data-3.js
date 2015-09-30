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
                console.log("\n" + results[i]['ID'].bold.yellow + "\t" + results[i]['email'].yellow + "\n\tPassword: " + colors.random(results[i]['password']));
                console.log("\tCreated: " + colors.cyan(results[i]["createdOn"]) + "\n\tModified: " + colors.cyan(results[i]['modifiedOn']));
            }
            console.log("\tAddress Book #" + colors.yellow(results[i]['AddressBookId']) + ": " + colors.rainbow(results[i]['name']));
            console.log("\t\tCreated: " + colors.magenta(results[i]['AddressBookCreatedDate']) + "\n\t\tModified: " + colors.magenta(results[i]['AddressBookModifiedDate']));
            
        }
    }
).finally(
    function() {
        connection.end();
    }
);
