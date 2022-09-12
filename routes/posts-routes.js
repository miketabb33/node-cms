const express = require('express')
const Post = require('../models/Post')
const router = express.Router()
const { uploadDir, uploadFileUnlessNull, removeFile } = require('../core/imageUploader')

const validateCreate = (body) => {
  const errors = []
  if (!body.title) {
    errors.push({ message: "Please enter a title"})
  }

  if (!body.body) {
    errors.push({ message: "Please enter a body"})
  }

  return errors
}

router.get('/', (req, res) => {
  Post.find({}).lean()
    .then(posts => {
      res.render('admin/posts/index', { posts: posts})
    })
    .catch(err => {
      res.send('Cant find posts')
    })  
})

router.get('/create', (req, res) => {
  res.render('admin/posts/create')
})

router.post('/create', (req, res) => {
  const validationErrors = validateCreate(req.body)

  if (validationErrors.length == 0) {
    const title = req.body.title
    const body = req.body.body
    const status = req.body.status
    const allowComments = req.body.allowComments == 'on'
    const fileName = uploadFileUnlessNull(req.files?.file)
  
    Post.create({title, body, status, allowComments, fileName})
      .then(_ => {
        req.flash('success_message', 'Post was created successfuly: ' + title)
        res.redirect('/admin/posts')
      })
      .catch(err => {
        res.send(err)
      })
  } else {
    res.render('admin/posts/create', {errors: validationErrors})
  }
})

router.get('/edit/:id', (req, res) => {
  Post.findById(req.params.id).lean()
    .then(post => {
      if(!post) { res.send('Cant find post') }
      res.render('admin/posts/edit', {post: post})
    })
    .catch(err => {
      res.send(err)
    })
})

router.put('/edit/:id', (req, res) => {
  Post.findById(req.params.id)
    .then(post => {
      post.title = req.body.title
      post.body = req.body.body
      post.status = req.body.status
      post.allowComments = req.body.allowComments == 'on'

      removeFile(post.fileName)
      post.fileName = uploadFileUnlessNull(req.files?.file)

      post.save()
      .then(updatedPost => {
        req.flash('success_message', 'Post was updated successfuly: ' + post.title)
        res.redirect('/admin/posts')
      })
      .catch(err => {
        console.log(err)
      })

    })
    .catch(err => {
      res.send(err)
    })
})

router.delete('/:id', (req, res) => {
  console.log(uploadDir)
  Post.findById(req.params.id)
  .then(post => {
    removeFile(post.fileName)
    post.remove()
    .then(_ => {
      req.flash('success_message', 'Post was updated deleted: ' + post.title)
      res.redirect('/admin/posts')
    })
    .catch(err => {
      console.log(err)
    })
  })
})

module.exports = router