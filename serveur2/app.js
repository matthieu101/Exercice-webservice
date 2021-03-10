const express = require('express')
const booksManager = require('./BooksManager')
const authorsManager = require('./AuthorsManager')
const cartsManager = require('./CartsManager')
require('dotenv').config()

// Define data api server
const dataApi = express();
dataApi.use(express.urlencoded({ extended: true }));

// Define cart api server
const cartApi = express();
cartApi.use(express.urlencoded({ extended: true }));

// Retrieve
var MongoClient = require('mongodb').MongoClient;

// Database Name
let dbData;
let dbCart;

// Use connect method to connect to the server
MongoClient.connect(process.env.DB_HOST, function(err, client) {
  console.log("Connected successfully to server");
  dbData = client.db(process.env.SERVER_1_DB_NAME);
  dbCart = client.db(process.env.SERVER_2_DB_NAME);
  if (err) console.error(err);
});

dataApi.get('/', (req, res) => {
  res.send('Hello data!')
})

dataApi.get('/books', (req, res) => {
  booksManager.GetBooks(function(items) {
    res.send(JSON.stringify(items));
  });
})

dataApi.get('/book/:name', (req, res) => {
  const nameBook = req.params.name;
  booksManager.GetBook(nameBook,function(items) {
    res.send(JSON.stringify(items));
  });
  
})

dataApi.delete('/book/delete/:name', (req, res) => {
  const nameBook = req.params.name;
  res.send(booksManager.DeleteBook(nameBook));
})

dataApi.post('/books/add', (req, res) => {
  res.send(booksManager.InsertBooks(req.body));
})

dataApi.put('/books/update/:name', (req, res) => {
  const nameBook = req.params.name;
  res.send(booksManager.UpdateBooks(nameBook,req.body));
})

dataApi.put('/books/updateStock/:name', (req, res) => {
  const nameBook = req.params.name;
  res.send(booksManager.UpdateStockBook(nameBook,req.body.stock));
})

dataApi.get('/authors', (req, res) => {
  authorsManager.GetAuthors(function(items) {
    console.log(items);
    res.send(JSON.stringify(items));
  });
})

dataApi.get('/author/:name', (req, res) => {
  const nameBook = req.params.name;
  authorsManager.GetAuthor(nameBoo,function(items) {
    console.log(items);
    res.send(JSON.stringify(items));
  });
})

dataApi.delete('/author/delete/:name', (req, res) => {
  const nameBook = req.params.name;
  res.send(authorsManager.DeleteBook(nameBook));
})

dataApi.post('/authors/add', (req, res) => {
  res.send(authorsManager.InsertAuthors(req.body));
})

dataApi.put('/authors/update/:name', (req, res) => {
  const nameBook = req.params.name;
  res.send(authorsManager.UpdateAuthors(nameBook));
})


/***************************************************************/

cartApi.post('/cart/add', (req, res) => {
  res.send(cartsManager.InsertCarts(req.body));
})

cartApi.put('/cart/addProduct/:id', (req, res) => {
  const id = req.params.id;
  res.send(cartsManager.AddProductCarts(id,req.body));
})

cartApi.put('/cart/confirmCart/:id', (req, res) => {
  const id = req.params.id;
  res.send(cartsManager.ConfirmeCarts(id));
})

  dataApi.listen(process.env.SERVER_1_PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.SERVER_1_PORT}`)
  })

  cartApi.listen(process.env.SERVER_2_PORT, () => {
    console.log(`Example app listening at http://localhost:${process.env.SERVER_2_PORT}`)
  })