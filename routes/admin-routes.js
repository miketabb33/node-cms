const express = require('express')
const Post = require('../models/Post')
const Comment = require('../models/Comment')
const faker = require('@faker-js/faker').faker
const router = express.Router()
const { removeAllUploads } = require('../core/imageUploader')
const { userAuthenticated } = require('../core/authentication')
const Category = require('../models/Category')

router.all('/*', userAuthenticated, (req, res, next) => {
  req.app.locals.layout = 'admin-layout'
  next()
})

router.get('/', (req, res) => {
  Post.count()
  .then(postCount => {
    Category.count()
    .then(categoryCount => {
      Comment.count()
      .then(commentCount => {
        res.render('admin/index', { postCount, categoryCount, commentCount })
      })
    })
  })
})

router.post('/fake-posts', (req, res) => {
  for(let i = 0; i < req.body.amount; i++) {
    const post = new Post()
    post.title = faker.random.words(4)
    post.body = faker.lorem.paragraphs(5)
    const statuses = ["Public","Private", "Draft"]
    post.status = statuses[Math.floor(Math.random()*statuses.length)]
    post.allowComments = Math.random() > 0.5 
    post.user = req.user

    post.save()
    .then(_ => {
    })
    .catch(err => {
      console.log(err)
    })
  }
  res.redirect('/admin/posts')
})

router.delete('/fake-posts', (req, res) => {
  removeAllUploads()


  Post.remove({})
  .then(_ => {
    Comment.remove({})
    .then(_ => {
      res.redirect('/admin/posts')
    })
  })
  .catch(err => {
    console.log(err)
  })
})

module.exports = router