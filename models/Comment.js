const mongoose = require('mongoose')

const CommentSchema = mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },

  body: {
    type: String,
    required: true,
  },

  date: {
    type: Date,
    default: Date.now()
  }
})

module.exports = mongoose.model('Comment', CommentSchema)