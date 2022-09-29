const express = require("express");
const router = express.Router()
const Post = require('../models/Post')
const Comment = require('../models/Comment')


router.get('/', (req, res) => {
  res.render('admin/comments/index')
})

router.post('/', (req, res) => {
  const body = req.body.body
  const postId = req.body.id
  const userId = req.user._id


  Comment.create({
    user: userId,
    body: body
  })
  .then(newComment => {
    Post.findById(postId)
    .then(post => {
      post.comments.push(newComment)
      post.save(savedPost => {
        res.redirect(`/show/${post._id}`)
      })
    })
  })
})


module.exports = router