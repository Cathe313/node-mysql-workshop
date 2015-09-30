var mysql = require('mysql');
var Promise = require('bluebird');
Promise.promisifyAll(mysql);
Promise.promisifyAll(require("mysql/lib/Connection").prototype);
Promise.promisifyAll(require("mysql/lib/Pool").prototype);

var connection = mysql.createConnection({
  host     : process.env.IP,
  user     : process.env.C9_USER,
  password : '',
  database : 'addressbook'
});

connection.queryAsync("SELECT Account.id, Account.email, Account.password, Account.createdOn, Account.modifiedOn, AddressBook.id AS addressBookId, AddressBook.accountId, AddressBook.name, AddressBook.createdOn AS AddressBookCreationDate, AddressBook.modifiedOn AS AddressBookModifiedDate FROM Account JOIN AddressBook ON AddressBook.accountId = Account.id;").spread(
    function(results) {
        console.log(results);
        return results;
    }    
).finally(
    function() {
        connection.end();
    }
);
