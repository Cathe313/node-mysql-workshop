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
                FROM Account JOIN AddressBook ON AddressBook.accountId = Account.id \
                WHERE Account.id BETWEEN 1 AND 10 \
                GROUP BY Account.id \
                ORDER BY Account.id;").spread(
    function(results) {
        return results;
    }    
).map(
    function(accountAndAddress) {
        connection.queryAsync("SELECT * FROM Entry WHERE addressBookId IN (" + accountAndAddress["AddressBookId"] + ") ORDER BY id LIMIT 10;").spread(
        function(entries) {
            console.log("\n" + colors.bold(accountAndAddress['ID']) + "\t" + colors.underline(accountAndAddress["email"]) + "\n\tPassword: " + colors.rainbow(accountAndAddress["password"]) + colors.cyan.bold("\n\tCreated On: ") + colors.cyan(accountAndAddress["createdOn"]) + colors.cyan.bold("\n\tModified On: ") + colors.cyan(accountAndAddress["modifiedOn"]) + "\n");
            console.log (colors.yellow("First Address Book (#" + accountAndAddress["AddressBookId"] + "):\t" + accountAndAddress["name"]));
            console.log(colors.yellow.bold("\tCreated On: ") + colors.yellow(accountAndAddress["AddressBookCreatedDate"]) + colors.yellow.bold("\n\tModified On: ") + colors.yellow(accountAndAddress["AddressBookModifiedDate"]));
            if (entries[0] === false) {
                console.log(colors.green.bold("\nEntries (Max. 10): "));
            }
            for (var i = 0; i < entries.length; i++) {
                console.log(colors.green("\n\tEntry ID: " + entries[i]['id'] + "\n\tFirst Name: " + entries[i]['firstName'] + "\n\tLast Name: " + entries[i]['lastName'] + "\n\tBirthday: " + entries[i]['birthday'] + "\n\tHome, Work or Other: " + entries[i]['type'] + "\n\tPhone, Address or Email: " + entries[i]['subtype'] + "\n\tContact Info (1st line): " + entries[i]['contentLineOne']));
                if (entries[i]['contentLineTwo'] != null) {
                    console.log(colors.green("\tContact Info (2nd line): " + entries[i]['contentLineTwo']));
                }
                if (entries[i]['contentLineThree'] != null) {
                    console.log(colors.green("\tContact Info (3rd line): " + entries[i]['contentLineThree']));
                }
                if (entries[i]['contentLineFour'] != null) {
                    console.log(colors.green("\tContact Info (4th line): " + entries[i]['contentLineFour']));
                }
                if (entries[i]['contentLineFive'] != null) {
                    console.log(colors.green("\tContact Info (5th line): " + entries[i]['contentLineFive']));
                }
            }
        });
    }
).finally(
    function() {
        connection.end();
    }
);
/*
console.log("\n" + accounts['ID'].bold + "\t" + accounts["email"].underline + "\n\tPassword: " + (accounts["password"]).rainbow + colors.cyan.bold("\n\tCreated On: ") + colors.cyan(accounts["createdOn"]) + "\n\t " + colors.cyan.bold("Modified On: ") + colors.cyan(accounts["modifiedOn"]) + "\n");
            console.log (colors.yellow("First Account (#" + addressbook[0]["id"] + "):\t" + addressbook[0]["name"]));
            console.log(colors.cyan.bold("\tCreated On: ") + colors.cyan(addressbook[0]["createdOn"]) + colors.cyan.bold("\n\tModified On: ") + colors.cyan(addressbook[0]["modifiedOn"]));
            */
            
            
            