//Set Up

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/beers');

var Beer = require("./BeerModel");

var app = express();

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.use(bodyParser.json());   // This is the type of body we're interested in
app.use(bodyParser.urlencoded({extended: false}));

app.set('view engine', 'ejs');

/**************Handle Requests****************/


//Sending HTML on first GET
app.get('/', function (req, res) {
  res.sendFile(__dirname + "/index.html");

});

//Send beers from DB to client on request
app.get('/beers', function (req, res) {
  Beer.find(function (error, beers){
  res.send(beers);
  });
});

//Add new beer to DB and send response to the user
app.post('/beers', function (req, res, next) {
  var beer = new Beer(req.body);

  beer.save(function(err, data) {
    if (err) { return next(err); }

    res.send(data);

  });
});

//Add new rating to excisting beer
app.put('/beers', function (req, res, next){
  // console.log(req.body);

  Beer.update({_id: req.body._id}, {$set:{rating: req.body.rating}}, function(err, data) {
    if (err) throw err;
    res.send(data);
  });

});

//Delete beer from DB on request and send response to client
app.delete('/beers/:beerId', function (req, res, next) {

  // console.log(req.params.beerId);

  Beer.findByIdAndRemove(req.params.beerId, function(err, data) {
    if (err) throw err;

    res.send(data);
    // Beer.find(function (error, beers){
    //   res.send(beers);
    // });
  });
});


app.listen(8000);