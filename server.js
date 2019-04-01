var http = require('http');
var express = require('express');
var app = express();
var MongoClient = require('mongodb').MongoClient;
var mongoose = require('mongoose');
var getPrevsAndFavs = require('./routers/getPrevsAndFavs');
var orders = require('./routers/orders');
var ordersOrdersId = require('./routers/ordersOrdersId');


/* ------------------Mongoose--------------------- */

var MongoURI = process.env.NODE_ENV === 'production' ? process.env.MONGODB_URI : 'mongodb://amituuush:Gomocha123!@ds139327.mlab.com:39327/gomocha'

mongoose.Promise = global.Promise;
mongoose.connect(MongoURI);

mongoose.connection.once('open', function() {
    console.log('connection established!');
});

mongoose.connection.on('error', function(err) {
    console.error('Could not connect.  Error:', err);
});


/* -----------------Express------------------------ */

function customerRequestHandler(request, response) {
    response.sendFile(__dirname + '/public/customer.html');
}

function BARequestHandler(request, response) {
    response.sendFile(__dirname + '/public/business-admin.html');
}

app.use(express.static(__dirname + '/public'));

app.use('/api', getPrevsAndFavs);
app.use('/api', orders);
app.use('/api', ordersOrdersId);

app.get('/admin', BARequestHandler)
app.get('/', customerRequestHandler);
app.get('/*', (req, res) => {
    res.redirect('/');
  });

var log = function() {
    console.log('app listening on port 4005');
}

app.listen(process.env.PORT || 4005, log);

module.exports = app;