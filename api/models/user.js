const mongoose = require("mongoose");
const bcrypt = require('bcrypt');
const config = require("config");
const jwt = require("jsonwebtoken");
const saltRounds = 10;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 2,
    maxlength: 50
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true
  },
  password: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 1024
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
});

userSchema.statics.add = async function (res) {
  const salt = await bcrypt.genSalt(saltRounds);
  const hashPassword = await bcrypt.hash(res.password, salt);

  let user = new this({
      name: res.name,
      email: res.email,
      password: hashPassword,
      isAdmin: res.isAdmin
  });
  user = await user.save();
  return user;
}

userSchema.methods.comparePassword = async function (password) {
  const validPassword = await bcrypt.compare(password, this.password);
  return validPassword;
}

userSchema.methods.generateAuthToken = function() {
  const token = jwt.sign(
    {
      _id: this._id,
      name: this.name,
      email: this.email,
      isAdmin: this.isAdmin
    },
    config.get("jwtPrivateKey"),
    {
      expiresIn: 1200
    }
  );
  return token;
};

mongoose.set('useCreateIndex', true);
const User = mongoose.model("User", userSchema);
exports.User = User;
