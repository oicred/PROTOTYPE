// required for routing from client to server
var express = require('express');
var app = express();
// required to save it in a DB
var sqlite3 = require('sqlite3');
//var db = new sqlite3.Database('hash.db'); 
// required to build the Merkle tree
var MerkleTools = require('merkle-tools');
var merkleTools = new MerkleTools();
var sha256 = require('js-sha256');

var path = require('path');
const fs = require('fs');


app.use(express.static(__dirname+'/public'));

//routes
app.get('/', function (request, response) {
       response.send('Hello world');
    
});

app.get('/comments', function (request, response) {
       console.log('get test');   
});

app.post('/test', function (request, response) {
       console.log('post test');
       alert('post test');   
});



app.listen(3000, function() { console.log("listening on port 3000");

// parse CSV
var file = path.resolve(__dirname,'demo.xls.csv');
var content = fs.readFileSync(file, "utf8");
var Papa = require('papaparse');
Papa.parse(content, {
    header: false,
    delimiter: "\t",
    complete: function(results) {
    rows = results.data;
    }
});

//convert rows in usable entries for the leaves of the Merkle tree
var entries = [];
console.log(rows);
console.log(rows[0][0]);


var arrayLength = rows.length;
for (var i = 0; i < arrayLength -1 ; i++) {
    entries[i] = rows[i][0]+rows[i][1];
}
console.log(entries);   //displays correctly the array

// adding the leaves to the Merkle tree
merkleTools.addLeaves(entries, true);
// create the merkle tree
merkleTools.makeTree(false);

var leafCount =  merkleTools.getLeafCount();

var leafValue =  merkleTools.getLeaf(0);
var leafValue1 =  merkleTools.getLeaf(1);
var leafValue2 =  merkleTools.getLeaf(2);
var leafValue3 =  merkleTools.getLeaf(3);

var proof0 = merkleTools.getProof(0);
var proof1 = merkleTools.getProof(1);
var proof2 = merkleTools.getProof(2);
var proof3 = merkleTools.getProof(3);
var proof4 = merkleTools.getProof(4);

// need to understand better this concept of proof
console.log(proof0);
console.log(proof1);
console.log(proof2);
console.log(proof3);
console.log(proof4);

// check the hash with another function
console.log(sha256(entries[0]));
console.log(sha256(entries[1]));
console.log(sha256(entries[2]));
console.log(sha256(entries[3]));
//console.log(sha256(sha256(entries[2])+sha256(entries[3])));
console.log(sha256(sha256(entries[0])+sha256(entries[1])));
console.log(sha256(entries[0])+sha256(entries[1]));

// values seems to be correct here
console.log(leafCount);
console.log(leafValue);
console.log(leafValue1);
console.log(leafValue2);
console.log(leafValue3);

//prooving that the first leave is part of the tree
var targetHash = sha256(entries[0]);
var merkleRoot = merkleTools.getMerkleRoot();
console.log(merkleTools.validateProof(proof0, targetHash, merkleRoot));

//storing the hash values in the DB
    //create table
    console.log('test 1');
   // db.run('CREATE TABLE hashes (position INTEGER, hash VARCHAR)');
    console.log('test 2');
  //  db.run('commit');
    //insert values
   // for (var i = 0; i < entries.length; i++) {
    //    var query = 'INSERT INTO hashes VALUES ('+i+',"'+sha256(entries[i])+'")';
    //    db.run(query);
    //}
    	

  const sqlite3 = require('sqlite3').verbose();
 
  let db = new sqlite3.Database('sample.db');

  // insert one row into the langs table
  for (var i = 0; i < entries.length; i++) {
  var row = [i, sha256(entries[i])];    
  db.run(`INSERT INTO hashes VALUES(?, ?)`, row, function(err) {
    if (err) {
      return console.log(err.message);
    }
    // get the last insert id
    console.log(`A row has been inserted with rowid ${this.lastID}`);
  });
  }
 

 
  // close the database connection
  db.close();

   console.log('test 3');
    //test get values
    //console.log(db.all('SELECT * FROM hashes'));
console.log('test 4');
Test(sha256(entries[0]));
});

function Test(hashcheck) {
  var dbentries = [];
  console.log(hashcheck);
  console.log('I am inside test');
  const sqlite3 = require('sqlite3').verbose();
 
// open the database
let db = new sqlite3.Database('sample.db');
 
let sql = `SELECT * FROM hashes`;
 
db.all(sql, [], (err, rows) => {
  if (err) {
    throw err;
  }
  rows.forEach((row) => {
    console.log(row);
  });
});
 
// close the database connection
db.close();
};