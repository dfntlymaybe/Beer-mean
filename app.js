
/*************imports***********/

var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

var passport = require('passport');
var expressSession = require('express-session');
var LocalStrategy = require('passport-local').Strategy;

mongoose.connect(process.env.MONGOLAB_OLIVE_URI || 'mongodb://localhost/beers');

//import mongoose DB models
var Beer = require("./models/BeerModel");
var Review = require("./models/reviewModel");
var User = require("./models/UserModel");


/**********Set Up*************/

var app = express();

app.use(expressSession({secret: 'mySecretKey'}));
app.use(passport.initialize());
app.use(passport.session());

app.use(express.static('public'));
app.use(express.static('node_modules'));

app.use(bodyParser.json());   // This is the type of body we're interested in
app.use(bodyParser.urlencoded({extended: false}));


//We want to send the client only username and id
passport.serializeUser(function (user, done) {
  user = {
    username: user.username,
    _id: user._id
  };

  done(null, user);
});

passport.deserializeUser(function (user, done) {
  user = {
    username: user.username,
    _id: user._id
  };

  done(null, user);
});



app.set('view engine', 'ejs');



/**************Handle Requests****************/


//Sending HTML on first GET
app.get('/', function (req, res) {

  console.log("New Client")
  res.sendFile(__dirname + "/index.html");

});

//Send beers from DB to client on request
app.get('/beers', function (req, res) {

  console.log("Send All beers");
  Beer.find(function (error, beers){
  res.send(beers);
  
  });
});

//Add new beer to DB and send response to the user
app.post('/beers', function (req, res, next) {

  console.log("Create new beer: " + req.body.name);
  var beer = new Beer(req.body);
  beer.save(function(err, data) {
    if (err) { return next(err); }

    res.send(data);

  });
});

//Add new rating to excisting beer
app.put('/beers', function (req, res, next){
  
  console.log("New rate: " + req.body.rating + " to beer: " + req.body.name);
  Beer.update({_id: req.body._id}, {$set:{rating: req.body.rating}}, function(err, data) {
    if (err) throw err;
    res.send(data);
  });

});

//Delete beer from DB on request and send response to client
app.delete('/beers/:beerId', function (req, res, next) {

  
  console.log("Delete beer: " + req.params.beerId);
  Beer.findByIdAndRemove(req.params.beerId, function(err, data) {
    if (err) throw err;

    res.send(data);
    // Beer.find(function (error, beers){
    //   res.send(beers);
    // });
  });
});

//Add a review to a spesific beer
app.post('/beers/:id/reviews', function(req, res, next) {
  Beer.findById(req.params.id, function(err, beer) {
    if (err) { return next(err); }

    var review = new Review(req.body);

    review.save(function(err, review) {
      if (err) { return next(err); }
      console.log("Add comment: " + review._id)
      beer.reviews.push(review);
      
      beer.save(function (err, beer) {
        if (err) { return next(err); }

        res.json(review);
      });
    });
  });

});

//Delete comment from DB on request and send response to client
app.delete('/beers/:beerId/reviews/:commentId', function (req, res, next) {

  console.log("removing comment: " + req.params.commentId + " from beer: " + req.params.beerId)

  Beer.update({_id: req.params.beerId}, {$pull: {reviews:{_id: req.params.commentId}}} , function(err, data) {
    if (err) throw err;
    res.send(data);

  });
});

//register new user
passport.use('register', new LocalStrategy(function (username, password, done) {
  User.findOne({ 'username': username }, function (err, user) {
    // In case of any error return
    if (err) {
      console.log('Error in SignUp: ' + err);
      return done(err);
    }

    // already exists
    if (user) {
      console.log('User already exists');
      return done(null, false);
    } else {
      // if there is no user with that matches
      // create the user
      var newUser = new User();

      // set the user's local credentials
      newUser.username = username;
      newUser.password = password;    // Note: Should create a hash out of this plain password!
      console.log(newUser.username + ' ' + newUser.password);
      // save the user
      newUser.save(function (err) {
        if (err) {
          console.log('Error in Saving user: ' + err);
          throw err;
        }

        console.log('User Registration successful');
        return done(null, newUser);
      });
    }
  });
}));

//New User registration
app.post('/register', passport.authenticate('register'), function (req, res) {
  res.json(req.user);
});

//Authenticate middleware for login
passport.use('login', new LocalStrategy(function (username, password, done) {
  User.findOne({ 'username': username, 'password': password }, function (err, user) {
    if (err) {
      return done(err); 
    }

    if (!user) { 
      return done(null, false); 
    }

    return done(null, user);
  });
}));

//listen to /login post requests
app.post('/login', passport.authenticate('login'), function (req, res) {
  console.log("login requested " + req.body);
  res.json(req.user);
});

app.get('/currentUser', function (req, res) {
  res.send(req.user);
});

//listen to /logout get request
app.get('/logout', function (req, res) {
  req.logout();
  res.redirect('/');
});




app.listen(process.env.PORT || '4000');