const axios = require('axios');
var MongoClient = require('mongodb').MongoClient;
require('dotenv').config()

collectionAuthorName = "authors"

function GetAuthors(callback)
{
  MongoClient.connect(process.env.DB_HOST, function(err, db) {
      if (err) throw err;
      var dbo = db.db(process.env.SERVER_1_DB_NAME);
      dbo.collection(collectionAuthorName).find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        return callback(result); 
      });
    });
}

function GetAuthor(data, callback)
{
  MongoClient.connect(process.env.DB_HOST, function(err, db) {
      if (err) throw err;
      var dbo = db.db(process.env.SERVER_1_DB_NAME);
      dbo.collection(collectionAuthorName).findOne({name:data}, function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        return callback(result); 
      });
    });
}

function DeleteAuthor(data)
{
  MongoClient.connect(process.env.DB_HOST, function(err, db) {
      if (err) throw err;
      var dbo = db.db(process.env.SERVER_1_DB_NAME);
      dbo.collection(collectionAuthorName).deleteOne({name:data},function(err, result) {
        if (err) throw err;
        console.log("1 document deleted");
        db.close();
      });
    });
}

function InsertAuthors(data)
{
    MongoClient.connect(process.env.DB_HOST, function(err, db) {
        if (err) throw err;
        var dbo = db.db(process.env.SERVER_1_DB_NAME);
        var myobj = { name: data.name, type: data.type };
        dbo.collection(collectionAuthorName).insertOne(myobj, function(err, res) {
          if (err) throw err;
          console.log("1 author inserted");
          db.close();
        });
      });
}

function UpdateAuthors(data, newdata)
{
    MongoClient.connect(process.env.DB_HOST, function(err, db) {
        if (err) throw err;
        var dbo = db.db(process.env.SERVER_1_DB_NAME);
        var myquery = { name: data };
        var myobj = {$set: { name: newdata.name, type: newdata.type }};
        dbo.collection(collectionAuthorName).updateOne(myquery, myobj, function(err, res) {
          if (err) throw err;
          console.log("1 author updated");
          db.close();
        });
      });
}

module.exports.GetAuthors = GetAuthors;
module.exports.GetAuthor = GetAuthor;
module.exports.DeleteAuthor = DeleteAuthor;
module.exports.InsertAuthors = InsertAuthors;
module.exports.UpdateAuthors = UpdateAuthors;