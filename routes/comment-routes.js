const express = require("express");
const router = express.Router()
const Post = require('../models/Post')
const Comment = require('../models/Comment')


router.get('/', (req, res) => {
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
        req.flash('success_message', "Comment approval pending")
        res.redirect(`/show/${post.slug}`)
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

router.post('/approve-comment/:id', (req, res) => {
  const commentId = req.params.id
  const value = req.body.value
  Comment.findById(commentId)
  .then(comment => {
    comment.allowComment = value

    comment.save()
    .then(_ => {
      res.status(201).send("Update Successful")
    })
    .catch(err => {
      res.status(404).send(err)
    })
  })
  .catch(err => {
    res.status(404).send(err)
  })

  
})

module.exports = router