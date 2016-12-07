
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var beerSchema = new Schema({
  name: String,
  abv: Number,
  style: String,
  img_url: String,
  rating: [Number]
});

var Beer = mongoose.model("beers", beerSchema);
module.exports = Beer;