const mongoose = require('mongoose');
const { isEmail } = require('validator')
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      minLength: 3,
      maxLength: 55,
      trim: true
    },
    email: {
      type: String,
      required: true,
      lowercase: true,
      validate: [isEmail],
      unique: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      max: 1024,
      minlength: 6
    },
    confirmationToken: {
      type: String,
      default: undefined
    },
    isConfirmed: {
      type: Boolean,
      default: false
    },
    profiliePicture:{
      type: String,
      default:""
    }
  },
  {
    timestamps: true,
  }
);

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next(); // Ne pas hacher si le mot de passe n'est pas modifié
  const salt = await bcrypt.genSalt();
  this.password = await bcrypt.hash(this.password, salt);
  next();
});



userSchema.statics.login = async function (email, password) {
  const user = await this.findOne({ email });
  if (user) {

    const auth = await bcrypt.compare(password, user.password);

    if (auth) {
      return user;
    }
    throw Error('incorrect password');
  }
  throw Error('incorrect email')
};


const UserModel = mongoose.model("user", userSchema);

module.exports = UserModel;