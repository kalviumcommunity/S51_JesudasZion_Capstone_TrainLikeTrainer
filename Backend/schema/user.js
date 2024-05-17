const mongoose = require("mongoose");
const Joi = require("joi");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    minlength: 3,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    minlength: 5,
    maxlength: 255,
    unique: true,
  },
  password: {
    type: String,
    required: false,
    maxlength: 1024,
    minlength: 5,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  profilePhoto: {
    type: String,
    required: false,
    maxlength: 1024,
    default: 'https://www.shareicon.net/data/512x512/2016/07/21/799323_user_512x512.png', // Default link
  },
  description: {
    type: String,
    required: false,
    maxlength: 500,
    default : ""
  },
});

userSchema.methods.generateAuthToken = function () {
  const token = jwt.sign(
    { _id: this._id, isAdmin: this.isAdmin },
    process.env.SECRET_TOKEN
  );
  return token;
};

const User = mongoose.model("User", userSchema);

// for registering validation
function validateUser(user) {
  const schema = Joi.object({
    name: Joi.string().min(3).max(30).required(),
    email: Joi.string()
      .email({
        minDomainSegments: 2,
        tlds: { allow: ["com", "net"] },
      })
      .required(),
    password: Joi.string().required().min(5).max(1024),
    username: Joi.string().required().min(3),
    profilePhoto: Joi.string().uri().max(1024).optional(),
    description: Joi.string().max(500).optional(),
  });
  return schema.validate(user);
}

// for login validation
function validates(user) {
  const schema = Joi.object({
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(1024).required(),
  });
  return schema.validate(user);
}

exports.User = User;
exports.validates = validates;
exports.validateUser = validateUser;
