const mongoose = require('mongoose');

const PostSchema = new mongoose.Schema(
  {
    posterId: {
      type: String,
      required: true
    },
    title: {
      type: String,
      required:true
    },
    message: {
      type: String,
      trim: true,
      maxlength: 500,
      required:true
    },
    picture: {
      type: String,
    },
    video: {
      type: String,
    },
    likers: {
      type: [String],
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model('post', PostSchema);