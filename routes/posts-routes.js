const express = require('express')
const Post = require('../models/Post')
const Category = require('../models/Category')
const router = express.Router()
const { uploadFileUnlessNull, removeFile } = require('../core/imageUploader')

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
  Post.find({}).populate('category').populate('user').lean()
    .then(posts => {
      res.render('admin/posts/index', { posts: posts })
    })
    .catch(err => {
      console.log(err)
      res.send('Cant find posts')
    })  
})

router.get('/create', (req, res) => {
  Category.find({}).lean()
  .then(categories => {
    res.render('admin/posts/create', {categories})
  })
})

router.post('/create', (req, res) => {
  const validationErrors = validateCreate(req.body)

  if (validationErrors.length == 0) {
    const title = req.body.title
    const body = req.body.body
    const status = req.body.status
    const allowComments = req.body.allowComments == 'on'
    const fileName = uploadFileUnlessNull(req.files?.file)
    const category = req.body.category
    const date = Date.now()
    const user = req.user
  
    Post.create({user, title, body, status, allowComments, fileName, category, date})
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
      Category.find({}).lean()
      .then(categories => {
        res.render('admin/posts/edit', {post, categories})
      })
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
      post.category = req.body.category
      post.date = Date.now()

      if (req.files?.file) {
        removeFile(post.fileName)
        post.fileName = uploadFileUnlessNull(req.files?.file)
      }

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
  Post.findById(req.params.id).populate('comments')
  .then(post => {
    
    post.comments.forEach(comment => {
      comment.remove()
    })

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