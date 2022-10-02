const express = require("express");
const router = express.Router()
const Post = require('../models/Post')
const Comment = require('../models/Comment')


router.get('/', (req, res) => {
  console.log(req.user._id)
  Comment.find({user: req.user._id}).populate('user').lean()
  .then(comments => {
    res.render('admin/comments/index', {comments})
  })
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

router.delete('/:id', (req, res) => {
  const commentId = req.params.id
  Comment.findOneAndRemove({_id: commentId})
  .then(deletedComment => {
    Post.findOneAndUpdate({comments: commentId}, {$pull: {comments: commentId}}, (err, data) => {
      res.redirect('/admin/comments')
    })
  })
})

module.exports = router