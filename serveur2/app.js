const express = require('express')
const assert = require('assert');
const axios = require('axios');
const app = express()
const port = 3000

// middleware
app.use(express.urlencoded({ extended: true }))

// Retrieve
var MongoClient = require('mongodb').MongoClient;
const { response } = require('express');

// Connection URL
const url = 'mongodb://localhost:27017';

// Database Name
const dbName = 'project';
let db;

// Use connect method to connect to the server
MongoClient.connect(url, function(err, client) {
  assert.equal(null, err);
  console.log("Connected successfully to server");

  db = client.db(dbName);

});

app.get('/', (req, res) => {
  res.send('Hello World!')
})

app.get('/paniers', async (req,res) => {
    try {
        const docs = await db.collection('paniers').find({}).toArray()
        res.status(200).json(docs)
    } catch (err) {
        console.log(err)
        throw err
    }
})

app.post('/paniers/add', async (req,res) => {
    res.send(insertPanier(req.body));
})

app.delete('/paniers/remove', async (req,res) => {
    res.send(removePanier(req.body));
})

app.delete('/paniers/confirme', async (req,res) => {
    res.send(confirmePanier());
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})

const insertPanier = async function(data) {
    try {
      console.log(data.bookId);
      let response = await axios.get('http://127.0.0.1/Exercice-webservice/books/'+data.bookId);
      console.log(response.data);
      
      const collection = db.collection('paniers');
      let found;
      collection.find({}).toArray(function(err, docs) {
        found = docs.find(elementid => elementid.bookId == data.bookId);
        console.log(found);
      
        if(response.data[0].stock - data.quantity >= 0)
        {
          if(found == undefined)
          {
              console.log("add");
              myobj = {bookId : response.data[0].id, nameBook:response.data[0].name, quantity: data.quantity, tmpStock: response.data[0].stock - data.quantity}
              collection.insertOne(myobj, function(err, res) {
                  assert.equal(err, null);
              });
          }else{
              console.log("update");
              var myquery = { id: found.id };
              var newvalues = { $set: {quantity: parseInt(found.quantity) + parseInt(data.quantity), tmpStock: parseInt(found.tmpStock) - parseInt(data.quantity) } };
              collection.updateOne(myquery, newvalues, function(err, res) {
                  if (err) throw err;
                  console.log("1 document updated");
              });
          }
        } else {
            throw ("Pas en stock !")
        }
      });  
    } catch (err) {
        console.log(err)
        throw err
    }
  }

  const removePanier = async function(data) {
    try {
      const collection = db.collection('paniers');
        myobj = {nameBook : data.nameBook}
        collection.deleteOne(myobj, function(err, res) {
            console.log("Removed the book with the field a equal to "+data.nameBook);
        });    
    } catch (err) {
        console.log(err)
        throw err
    }
  }

  const confirmePanier = async function() {
    try {
        const collection = db.collection('paniers');
        // Find some documents
        collection.find({}).toArray(function(err, docs) {
          docs.forEach(
              async element => {
                const params = new URLSearchParams()
                params.append('stock', element.tmpStock)
                const config = {
                  headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                  }
                }
                console.log(element)
                let response = await axios.put('http://127.0.0.1/Exercice-webservice/books/'+element.bookId,params, config);
                console.log(response.data);
                var myquery = { id: element.id };
                collection.deleteOne(myquery, function(err, obj) {
                  if (err) throw err;
                  console.log("1 document deleted");
                });
              }
            );
        }); 
    } catch (err) {
        console.log(err)
        throw err
    }
  }