const axios = require('axios');
var MongoClient = require('mongodb').MongoClient;
require('dotenv').config()
const zmq = require('zeromq');

let collectionBookName = "books"

async function runServer() {
  const sock = new zmq.Reply();

  await sock.bind('tcp://*:5555');

  for await (const [msg] of sock) {
    let o = JSON.parse(msg.toString());
    if(o.action === "buy") {
      GetBook(o.bookName,function(book) {
        if(parseInt(book.stock) - parseInt(o.quantity) >= 0) {
          UpdateStockBook(o.bookName, parseInt(book.stock) - parseInt(o.quantity) )
          console.log("livres, décompte stock")
        } else {
          console.log("livres, il n'y pas assez de livre en stock")
          return;
        }
      })
    }
    await sock.send('item');
    // Do some 'work'
  }
}

function GetBooks(callback)
{
  MongoClient.connect(process.env.DB_HOST, function(err, db) {
      if (err) throw err;
      var dbo = db.db(process.env.SERVER_1_DB_NAME);
      dbo.collection(collectionBookName).find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        return callback(result); 
      });
    });
}

function GetBook(data, callback)
{
  return MongoClient.connect(process.env.DB_HOST, function(err, db) {
      if (err) throw err;
      var dbo = db.db(process.env.SERVER_1_DB_NAME);
      return dbo.collection(collectionBookName).findOne({name:data}, function(err, result) {
        if (err) throw err;
        console.log(result);
        return callback(result);    
      });
    });
}

function DeleteBook(data)
{
  MongoClient.connect(process.env.DB_HOST, function(err, db) {
      if (err) throw err;
      var dbo = db.db(process.env.SERVER_1_DB_NAME);
      dbo.collection(collectionBookName).deleteOne({name:data},function(err, result) {
        if (err) throw err;
        console.log("1 document deleted");
        db.close();
      });
    });
}

function InsertBooks(data)
{
    MongoClient.connect(process.env.DB_HOST, function(err, db) {
        if (err) throw err;
        var dbo = db.db(process.env.SERVER_1_DB_NAME);
        var myobj = { name: data.name, author: data.author, stock: data.stock, price: data.price };
        dbo.collection(collectionBookName).insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 book inserted");
          db.close(); 
        });
      });
}

function UpdateBooks(data, newdata)
{
    MongoClient.connect(process.env.DB_HOST, function(err, db) {
        if (err) throw err;
        var dbo = db.db(process.env.SERVER_1_DB_NAME);
        var myquery = { name: data };
        var myobj = {$set: { name: newdata.name, author: newdata.author, stock: newdata.stock, price: data.price }};
        dbo.collection(collectionBookName).updateOne(myquery, myobj, function(err, res) {
          if (err) throw err;
          console.log("1 book updated");
          db.close();
        });
      });
}

function UpdateStockBook(data, newdata)
{
    MongoClient.connect(process.env.DB_HOST, function(err, db) {
        if (err) throw err;
        var dbo = db.db(process.env.SERVER_1_DB_NAME);
        var myquery = { name: data };
        var myobj = {$set: { stock: newdata }};
        dbo.collection(collectionBookName).updateOne(myquery, myobj, function(err, res) {
          if (err) throw err;
          console.log("1 stock book updated");
          db.close();
        });
      });
}

module.exports.GetBooks = GetBooks;
module.exports.GetBook = GetBook;
module.exports.DeleteBook = DeleteBook;
module.exports.InsertBooks = InsertBooks;
module.exports.UpdateBooks = UpdateBooks;
module.exports.UpdateStockBook = UpdateStockBook;

runServer();