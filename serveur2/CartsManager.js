const axios = require('axios');
var MongoClient = require('mongodb').MongoClient;
var ObjectId = require('mongodb').ObjectID;
const zmq = require('zeromq');
require('dotenv').config()

let collectionCardName = "carts"

function GetCarts(callback)
{
  MongoClient.connect(process.env.DB_HOST, function(err, db) {
      if (err) throw err;
      var dbo = db.db(process.env.SERVER_2_DB_NAME);
      dbo.collection(collectionCardName).find({}).toArray(function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        return callback(result); 
      });
    });
}

function GetCart(data, callback)
{
  MongoClient.connect(process.env.DB_HOST, function(err, db) {
      if (err) throw err;
      var dbo = db.db(process.env.SERVER_2_DB_NAME);
      dbo.collection(collectionCardName).findOne({name:data}, function(err, result) {
        if (err) throw err;
        console.log(result);
        db.close();
        return callback(result); 
      });
    });
}

function DeleteCart(data)
{
  MongoClient.connect(process.env.DB_HOST, function(err, db) {
      if (err) throw err;
      var dbo = db.db(process.env.SERVER_2_DB_NAME);
      dbo.collection(collectionCardName).deleteOne({name:data},function(err, result) {
        if (err) throw err;
        console.log("1 document deleted");
        db.close();
      });
    });
}

function InsertCarts(data)
{
    MongoClient.connect(process.env.DB_HOST, async function(err, db) {
        if (err) throw err;
        var dbo = db.db(process.env.SERVER_2_DB_NAME);
        try{
            let response = await axios.get('http://127.0.0.1:8080/book/'+data.name);
            console.log(response.data)
            if(response.data.stock - data.quantity < 0)
            {
                throw err('Stock out')
            } else {
                var myobj = { product: [{name: data.name, quantity: data.quantity, price: parseInt(data.quantity) *  parseInt(response.data.price)}], confirmed: false};
                dbo.collection(collectionCardName).insertOne(myobj, function(err, res) {
                  if (err) throw err;
                  console.log("1 cart inserted");
                  db.close();
                });
            }
        }catch(err) {
            console.log(err);
        }
      });
}

function AddProductCarts(id, data)
{
    MongoClient.connect(process.env.DB_HOST, async function(err, db) {
        if (err) throw err;
        var dbo = db.db(process.env.SERVER_2_DB_NAME);
        console.log(data.name);
        try{
            let response = await axios.get('http://127.0.0.1:8080/book/'+data.name);
            if(response.data.stock - data.quantity < 0)
            {
                throw err('Stock out')
            } else {
                console.log(id);
                var myquery = { _id: ObjectId(id) };
                var myobj = {$push: { product: {name: data.name, quantity: data.quantity, price: parseInt(data.quantity) *  parseInt(response.data.price)}}};
                dbo.collection(collectionCardName).findOne({_id:ObjectId(id)}, function(err, result) {
                    if (err) throw err;
                    console.log(result);
                })
                dbo.collection(collectionCardName).updateOne(myquery,myobj, function(err, res) {
                  if (err) throw err;
                  console.log("1 cart inserted more");
                  db.close();
                });
            }
        }catch(err) {
            console.log(err);
        }
      });
}

function UpdateCarts(data, newdata)
{
    MongoClient.connect(process.env.DB_HOST, function(err, db) {
        if (err) throw err;
        var dbo = db.db(process.env.SERVER_2_DB_NAME);
        var myquery = { name: data };
        var myobj = {$set: { product: [{name: newdata.name, quantity: newdata.quantity, price: newdata.price}], confirmed: newdata.confirmed}};
        dbo.collection(collectionCardName).updateOne(myquery, myobj, function(err, res) {
          if (err) throw err;
          console.log("1 cart updated");
          db.close();
        });
      });
}

function UpdateStockCart(data, newdata)
{
    MongoClient.connect(process.env.DB_HOST, function(err, db) {
        if (err) throw err;
        var dbo = db.db(process.env.SERVER_2_DB_NAME);
        var myquery = { name: data };
        var myobj = {$set: { stock: newdata.stock }};
        dbo.collection(collectionCardName).updateOne(myquery, myobj, function(err, res) {
          if (err) throw err;
          console.log("1 stock cart updated");
          db.close();
        });
      });
}

function ConfirmeCarts(id)
{
    MongoClient.connect(process.env.DB_HOST, function(err, db) {
        if (err) throw err;
        var dbo = db.db(process.env.SERVER_2_DB_NAME);
        try{
            dbo.collection(collectionCardName).findOne({_id:ObjectId(id)}, async function(err, result) {
              console.log(result.confirmed);
                if (result.confirmed != false ){
                    console.log("Already confirmed")
                    return null;
                } 
                if (err) throw err;
                console.log(result);
                await result.product.forEach(async (element,index) => {
                  const sock = new zmq.Request();
                  sock.connect('tcp://localhost:5555');
                  await sock.send(JSON.stringify({ action: "buy", bookName: element.name, quantity: element.quantity }));
                  const [result] = await sock.receive();
                  console.log('Received ', result.toString(), index);
                  /*
                  let response = await axios.get('http://127.0.0.1:8080/book/'+element.name);
                  const params = new URLSearchParams()
                  params.append('stock', parseInt(response.data.stock) - parseInt(element.quantity))
                  const config = {
                      headers: {
                        'Content-Type': 'application/x-www-form-process.env.DB_HOSTencoded'
                      }
                    }
                  await axios.put('http://127.0.0.1:8080/books/updateStock/'+element.name,params,config);
                  */
                });
                var myquery = { _id: ObjectId(id) };
                var myobj = {$set: { confirmed: true }};
                dbo.collection(collectionCardName).updateOne(myquery, myobj, function(err, res) {
                  if (err) throw err;
                  console.log("1 cart updated");
                  db.close();
                });
            });
        }catch(err) {
            console.log(err);
        }
      });
}

module.exports.GetCarts = GetCarts;
module.exports.GetCart = GetCart;
module.exports.DeleteCart = DeleteCart;
module.exports.InsertCarts = InsertCarts;
module.exports.AddProductCarts = AddProductCarts;
module.exports.UpdateCarts = UpdateCarts;
module.exports.UpdateStockCart = UpdateStockCart;
module.exports.ConfirmeCarts = ConfirmeCarts;