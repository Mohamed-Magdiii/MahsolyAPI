const mongoose = require("mongoose");
const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  location: {
    type: String,
  },
  image: {
    type: String,
    default: "",
  },
  favourites: {
    type: Array,
    default: [],
  },
});

module.exports = mongoose.model("User", userSchema);
