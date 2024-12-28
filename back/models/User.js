const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    lastName: { 
      type: String, 
      required: function () {
        return !this.googleId;
      }
    },
    email: { type: String, required: true, unique: true },
    password: { 
      type: String, 
      required: function () {
        return !this.googleId;
      }
    },
    phoneNumber: { type: String },
    token: { type: String },
    avatar: { type: String },
    googleId: { 
      type: String,
      index: {
        unique: true,
        partialFilterExpression: { googleId: { $exists: true, $ne: null } }
      }
    }
  },
  {
    timestamps: true
  }
);
module.exports = mongoose.model('User', userSchema);