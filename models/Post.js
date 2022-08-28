const mongoose = require('mongoose')

const PostSchema = mongoose.Schema({
  title: {
    type: String,
    required: true,
  },

  body: {
    type: String,
    required: true,
  },

  allowComments: {
    type: Boolean,
    required: true,
  },

  status: {
    type: String,
    default: 'public'
  },

  fileName: {
    type: String
  }
})

module.exports = mongoose.model('Post', PostSchema)