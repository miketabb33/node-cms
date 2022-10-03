const mongoose = require('mongoose')
const urlSlug = require('mongoose-url-slugs')

const PostSchema = mongoose.Schema({
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category'
  },

  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'users',
    required: true
  },

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
  },

  slug: {
    type: String
  },

  comments: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Comment'
  }],

  date: {
    type: Date,
    default: Date.now()
  }
})

PostSchema.plugin(urlSlug('title', {field: 'slug'}))

module.exports = mongoose.model('Post', PostSchema)
