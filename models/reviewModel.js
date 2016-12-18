
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var reviewSchema = new Schema({
  userName: String,
  text: String
  //comment: String
});

var Review = mongoose.model("Review", reviewSchema);
module.exports = Review;