
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var userSchema = new Schema({
  userName: String,
  password: String
});

var User = mongoose.model("user", userSchema);
module.exports = User;