'use strict';

// Information
const fs = require('fs');
const fetch = require("node-fetch");
const bitcore = require('bitcore-lib');
const message = require('bitcore-message');
const mysql = require('mysql');

// Set up database connection
var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
  database: "proofof"
});

con.connect(function(err) {
  if (err) throw err;
    
    // Verify connection
    console.log("Connected!");
    var rawdata = fs.readFileSync('walletaddress.json');

    // read the file and store the address+signature+message and check the balance by external api
    var arr = JSON.parse(rawdata);
    arr.forEach(function(elementObject){
        var keys = Object.keys(elementObject);
        var address = elementObject["addresscli"];
        var signature = elementObject["signature"];
        var verified = message('hello, world').verify(address, signature);

 

    if (verified == true) {

    fetch('https://blockchain.info/balance?active='+address)
            .then(response => response.json())
            .then(data => {
                // Reading the balance
                var balanceadd = data[address]['final_balance'];

                // Constrution values and store it on the DB
                const verifiedinfo = {
                  address: address,
                  balance: balanceadd,
                  verified: 'true'};

                  con.query('INSERT INTO exchange_accounts SET ?',verifiedinfo, function (err, result) {
                    if (err) throw err;
                  });

                console.log('----------------------'); 
                console.log(address);
                console.log(data[address]['final_balance']);
                console.log(verified);
                con.end();
             })
            .catch(err => {
                // Error output from fech
             console.log(err);     
             })
    }
    });
});
