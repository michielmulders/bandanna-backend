/* App Initializing */
const express = require('express')
const app = express()
var port = process.env.PORT || 3005

/* bodyParser */
var bodyParser = require('body-parser')
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({extended: false}))

/* API Routes */
var messageRoutes = require('./routes/message')
app.use('/message', messageRoutes)

/* API Endpoints */
app.get('/', function (req, res) {
  res.send('Hello World! Root domain!')
})

/* API Headers */
app.use(function (req, res, next) {

  // Website you wish to allow to connect
  res.setHeader('Access-Control-Allow-Origin', '*');

  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');

  // Pass to next layer of middleware
  next();
});

/* Serve API */
app.listen(port, function () {
  console.log('Example app listening on port 3005!')
})